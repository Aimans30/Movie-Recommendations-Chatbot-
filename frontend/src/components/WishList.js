import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WishList.css';

const WishList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', details: '', type: '' });

  const handleOpenModal = () => {
    const username = localStorage.getItem('username');
    if (username && username !== '') {
      setIsModalOpen(true);
    } else {
      alert('Please log in to access your wishlist!');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/wishlist/', {
          headers: { 'Content-Type': 'application/json' },
        });
        setWishlistItems(response.data.items);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddItem = async (e) => {
    e.preventDefault();
    const itemData = {
      type: newItem.type,
      title: newItem.title,
      details: newItem.details || '',
    };

    try {
      await axios.post('http://localhost:5000/api/wishlist/add', itemData, {
        headers: { 'Content-Type': 'application/json' },
      });
      setNewItem({ title: '', details: '', type: '' });
      setShowAddForm(false);
      const response = await axios.get('http://localhost:5000/api/wishlist/', {
        headers: { 'Content-Type': 'application/json' },
      });
      setWishlistItems(response.data.items);
    } catch (error) {
      console.error('Error adding item:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteItem = async (itemId, type, title) => {
    try {
      await axios.delete('http://localhost:5000/api/wishlist/remove', {
        headers: { 'Content-Type': 'application/json' },
        data: { type, title },
      });
      setWishlistItems(wishlistItems.filter((item) => item.title !== title || item.type !== type));
    } catch (error) {
      console.error('Error deleting item:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <button className="open-wishlist-button" onClick={handleOpenModal}>
        Wishlist
      </button>

      {isModalOpen && (
        <div className="wishlist-popup-overlay show">
          <div className="wishlist-popup">
            <h1>{showAddForm ? 'Add to Wishlist' : 'Your Wishlist'}</h1>
            {showAddForm ? (
              <form className="wishlist-form" onSubmit={handleAddItem}>
                <label>
                  Title:
                  <input
                    type="text"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Details:
                  <textarea
                    value={newItem.details}
                    onChange={(e) => setNewItem({ ...newItem, details: e.target.value })}
                    placeholder="Enter details (optional)"
                  />
                </label>
                <label>
                  Type:
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                    required
                  >
                    <option value="">Select type</option>
                    <option value="movie">Movie</option>
                    <option value="game">Game</option>
                  </select>
                </label>
                <button type="submit" className="submit-button">Add Item</button>
                <button type="button" className="close-button" onClick={() => setShowAddForm(false)}>Cancel</button>
              </form>
            ) : (
              <div className="wishlist-view">
                <ul>
                  {wishlistItems.map((item) => (
                    <li key={item._id}>
                      <span>{item.type.toUpperCase()}:</span> {item.title}
                      {item.details && ` - ${item.details}`}
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteItem(item._id, item.type, item.title)}
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
                <button className="submit-button" onClick={() => setShowAddForm(true)}>Add New Item</button>
                <button className="close-button" onClick={handleCloseModal}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WishList;
