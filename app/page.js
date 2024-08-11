'use client'
import Image from "next/image";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { Box, Modal, TextField, Typography, Stack, Button, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { getDocs, collection, query, doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
    // alert(`Item "${item}" added successfully!`); // Notification
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
      await updateInventory();
      // alert(`Item "${item}" removed successfully!`); // Notification
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ['Name', 'Quantity'];
    csvRows.push(headers.join(','));

    inventory.forEach(({ name, quantity }) => {
      csvRows.push([name, quantity].join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      gap={4}
      flexDirection="column"
      bgcolor="#1a1a1a"
      color="#e0e0e0"
    >
      <Typography variant="h3" gutterBottom sx={{ color: '#00FF9D' }}>
        YOUR PANTRY
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Search Items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            sx: {
              color: '#e0e0e0',
              borderColor: '#00FF9D',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#00FF9D',
                },
                '&:hover fieldset': {
                  borderColor: '#00FF9D',
                },
              },
              '& .MuiSvgIcon-root': {
                color: '#00FF9D',
              },
            },
            endAdornment: (
              <IconButton>
                <SearchIcon sx={{ color: '#00FF9D' }} />
              </IconButton>
            ),
          }}
          sx={{ input: { color: '#e0e0e0' }, borderColor: '#00FF9D' }}
        />
        <Button variant="contained" sx={{
          bgcolor: '#00FF9D',
          color: '#1a1a1a',
          '&:hover': {
            bgcolor: '#00cc7a',
          },
        }} onClick={handleOpen}>
          Add New Item
        </Button>
        <Button variant="contained" sx={{
          bgcolor: '#00FF9D',
          color: '#1a1a1a',
          '&:hover': {
            bgcolor: '#00cc7a',
          },
        }} onClick={exportToCSV}>
          Export CSV
        </Button>
      </Stack>

      <Box width="800px" maxHeight="400px" overflow="auto" border="1px solid #333" borderRadius="8px" mt={2}>
        {filteredInventory.length > 0 ? (
          filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#2a2a2a"
              padding="16px"
              borderBottom="1px solid #444"
              sx={{
                '&:hover': {
                  backgroundColor: '#333',
                },
              }}
            >
              <Typography variant="h6" sx={{ color: '#00FF9D' }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h6" sx={{ color: '#e0e0e0' }}>
                Quantity: {quantity}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" sx={{
                  bgcolor: '#00FF9D',
                  color: '#1a1a1a',
                  '&:hover': {
                    bgcolor: '#00cc7a',
                  },
                }} onClick={() => addItem(name)}>
                  Add
                </Button>
                <Button variant="contained" sx={{
                  bgcolor: '#FFC000',
                  color: '#1a1a1a',
                  '&:hover': {
                    bgcolor: '#E0BFB8',
                  },
                }} onClick={() => removeItem(name)}>
                  Remove
                </Button>
              </Stack>
            </Box>
          ))
        ) : (
          <Typography variant="h6" color="#e0e0e0" align="center" padding="20px">
            No items found
          </Typography>
        )}
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width="400px"
          bgcolor="#2a2a2a"
          border="2px solid #00FF9D"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={2}
          sx={{
            transform: 'translate(-50%, -50%)',
            borderRadius: '8px',
          }}
        >
          <Typography variant="h6" sx={{ color: '#00FF9D' }}>
            Add New Item
          </Typography>
          <TextField
            variant="outlined"
            fullWidth
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{
              input: { color: '#e0e0e0' },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#00FF9D',
                },
                '&:hover fieldset': {
                  borderColor: '#00FF9D',
                },
              },
            }}
          />
          <Button
            variant="contained"
            sx={{
              bgcolor: '#00FF9D',
              color: '#1a1a1a',
              '&:hover': {
                bgcolor: '#00cc7a',
              },
            }}
            onClick={() => {
              addItem(itemName);
              setItemName('');
              handleClose();
            }}
          >
            Add Item
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
