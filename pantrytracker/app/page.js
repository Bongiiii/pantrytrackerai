"use client";
import { Box, Stack, Typography, Button, TextField, Modal } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, query, getDocs, setDoc, doc, updateDoc, deleteDoc, getDoc, increment } from "firebase/firestore";
import { useEffect, useState } from "react";
import Chatbot from "../Chatbot"; // Adjust the path according to your file structure

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [warningOpen, setWarningOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleWarningOpen = (item) => {
    setSelectedItem(item);
    setWarningOpen(true);
  };
  const handleWarningClose = () => setWarningOpen(false);

  const updatePantry = async () => {
    try {
      const snapshot = query(collection(firestore, 'pantry'));
      const docs = await getDocs(snapshot);
      const pantryList = [];
      docs.forEach((doc) => {
        pantryList.push({ id: doc.id, ...doc.data() });
      });
      setPantry(pantryList);
    } catch (error) {
      console.error("Error fetching pantry items: ", error);
    }
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const handleAddItem = async () => {
    if (itemName.trim() !== '') {
      try {
        const docRef = doc(firestore, 'pantry', itemName.trim());
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
          // If item does not exist, create it with count 1
          await setDoc(docRef, { count: 1 });
        }
        
        setItemName('');
        handleClose();
        updatePantry();
      } catch (error) {
        console.error("Error adding item: ", error);
      }
    }
  };

  const handleIncrementItem = async (itemId) => {
    try {
      const docRef = doc(firestore, 'pantry', itemId);
      await updateDoc(docRef, { count: increment(1) });
      updatePantry();
    } catch (error) {
      console.error("Error incrementing item count: ", error);
    }
  };

  const handleRemoveItem = async () => {
    if (selectedItem) {
      try {
        const docRef = doc(firestore, 'pantry', selectedItem.id);
        const docSnapshot = await getDoc(docRef);
        const itemData = docSnapshot.data();

        if (itemData.count === 1) {
          // Ask for authorization if count is 1
          await deleteDoc(docRef);
        } else {
          // Decrement count if more than 1
          await updateDoc(docRef, { count: increment(-1) });
        }
        handleWarningClose();
        updatePantry();
      } catch (error) {
        console.error("Error removing item: ", error);
      }
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor={'#ADD8E6'}
      flexDirection={'column'}
      border={'1px solid #333'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <TextField
            id="outlined-basic"
            label="Item"
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="contained" onClick={handleAddItem}>Add</Button>
            <Button variant="outlined" onClick={handleClose}>Cancel</Button>
          </Stack>
        </Box>
      </Modal>

      <Modal
        open={warningOpen}
        onClose={handleWarningClose}
        aria-labelledby="warning-modal-title"
        aria-describedby="warning-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="warning-modal-title" variant="h6" component="h2">
            Remove Item
          </Typography>
          <Typography id="warning-modal-description" variant="body1">
            Are you sure you want to remove {selectedItem?.id} from the pantry?
          </Typography>
          <Stack direction="row" spacing={2} mt={2}>
            <Button variant="contained" onClick={handleRemoveItem}>Yes</Button>
            <Button variant="outlined" onClick={handleWarningClose}>No</Button>
          </Stack>
        </Box>
      </Modal>

      <Button variant="contained" onClick={handleOpen}>ADD</Button>

      <Box
        width={'800px'}
        height={'100px'}
        bgcolor={'#f0f0f0'}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}
        border={'1px solid #333'}
      >
        <Typography
          variant={"h2"}
          color={'#333'}
          textAlign={'center'}
        >
          Pantry Items
        </Typography>
      </Box>

      <Stack
        width="800px"
        height="300px"
        spacing={2}
        overflow={'auto'}
      >
        {pantry.map((item) => (
          <Stack key={item.id} direction={'row'} spacing={2} alignItems={'center'}>
            <Box
              width="100%"
              minHeight="150px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor={'#f0f0f0'}
            >
              <Typography
                variant={"h3"}
                color={'#333'}
                textAlign={'center'}
              >
                {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
              </Typography>
            </Box>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
              <Button variant="outlined" onClick={() => handleIncrementItem(item.id)}>+</Button>
              <Typography variant={"h6"}>{item.count}</Typography>
              <Button variant="outlined" onClick={() => handleWarningOpen(item)}>−</Button>
            </Stack>
          </Stack>
        ))}
      </Stack>

      {/* Integrate the Chatbot component */}
      <Chatbot />
    </Box>
  );
}
