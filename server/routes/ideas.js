const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// @route   GET /api/ideas
// @desc    Get all ideas
// @access  Public
router.get('/', async (req, res) => {
  try {
    console.log('Fetching all ideas from database...');
    const ideas = await Idea.find().sort({ order: 1 });
    console.log(`Found ${ideas.length} ideas in database`);
    res.json(ideas);
  } catch (error) {
    console.error('Error fetching ideas:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/ideas/:id
// @desc    Get single idea
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    console.log(`Fetching idea with ID: ${req.params.id}`);
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      console.log(`Idea with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    console.log(`Found idea: ${idea.title}`);
    res.json(idea);
  } catch (error) {
    console.error('Error fetching idea:', error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/ideas
// @desc    Create a new idea
// @access  Public
router.post('/', async (req, res) => {
  try {
    console.log('Creating new idea with data:', JSON.stringify(req.body));
    
    // Validate required fields
    if (!req.body.title) {
      console.log('Title is required but not provided');
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Get the highest order value
    const highestOrder = await Idea.findOne().sort({ order: -1 }).select('order');
    const order = highestOrder ? highestOrder.order + 1 : 0;
    console.log(`Assigning order ${order} to new idea`);
    
    // Create new idea with the next order value
    const newIdea = new Idea({
      ...req.body,
      order
    });
    
    console.log('Saving new idea to database with model:', JSON.stringify(newIdea));
    
    try {
      // Save the idea to the database
      const idea = await newIdea.save();
      console.log(`Idea saved successfully with ID: ${idea._id}`);
      
      // Verify the idea was saved
      const savedIdea = await Idea.findById(idea._id);
      console.log(`Verification - Idea exists in DB: ${savedIdea ? 'Yes' : 'No'}`);
      if (savedIdea) {
        console.log('Saved idea details:', JSON.stringify(savedIdea));
      }
      
      // Return the saved idea
      return res.status(201).json(idea);
    } catch (saveError) {
      console.error('Error saving idea to database:', saveError);
      return res.status(500).json({ error: 'Failed to save idea to database', details: saveError.message });
    }
  } catch (error) {
    console.error('Error creating idea:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// @route   PUT /api/ideas/:id
// @desc    Update an idea
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    console.log(`Updating idea with ID: ${req.params.id}`);
    let idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      console.log(`Idea with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    console.log('Found idea, updating with new data:', req.body);
    // Update the idea
    idea = await Idea.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, updatedAt: Date.now() }, 
      { new: true, runValidators: true }
    );
    
    if (!idea) {
      console.log(`Idea with ID ${req.params.id} not found after update`);
      return res.status(404).json({ error: 'Idea not found after update' });
    }
    
    console.log(`Idea updated successfully: ${idea.title}`);
    res.json(idea);
  } catch (error) {
    console.error('Error updating idea:', error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/ideas/:id
// @desc    Delete an idea
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Deleting idea with ID: ${req.params.id}`);
    const idea = await Idea.findById(req.params.id);
    
    if (!idea) {
      console.log(`Idea with ID ${req.params.id} not found`);
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    console.log(`Found idea, deleting: ${idea.title}`);
    await idea.deleteOne();
    
    console.log('Idea deleted successfully');
    // Return success message
    res.json({ success: true, message: 'Idea removed', id: req.params.id });
  } catch (error) {
    console.error('Error deleting idea:', error);
    
    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Idea not found' });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/ideas/reorder
// @desc    Reorder ideas
// @access  Public
router.put('/reorder', async (req, res) => {
  try {
    console.log('Reordering ideas');
    const { orderedIds } = req.body;
    
    if (!orderedIds || !Array.isArray(orderedIds)) {
      console.log('Ordered IDs array is required but not provided or not an array');
      return res.status(400).json({ error: 'Ordered IDs array is required' });
    }
    
    console.log(`Reordering ${orderedIds.length} ideas`);
    // Update order for each idea
    const updatePromises = orderedIds.map((id, index) => {
      console.log(`Setting order ${index} for idea with ID: ${id}`);
      return Idea.findByIdAndUpdate(id, { order: index }, { new: true });
    });
    
    await Promise.all(updatePromises);
    console.log('All ideas reordered successfully');
    
    // Get updated ideas
    const ideas = await Idea.find().sort({ order: 1 });
    console.log(`Returning ${ideas.length} reordered ideas`);
    
    res.json(ideas);
  } catch (error) {
    console.error('Error reordering ideas:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
