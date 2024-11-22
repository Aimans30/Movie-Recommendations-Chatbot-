import { useState } from 'react';
import axios from 'axios';
import './WishList.css'; // Import the CSS file

const WishList = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [type, setType] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(true); // Set the modal to open by default

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setType(value);
    } else {
      setType('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type || !title.trim()) {
      alert('Please provide both title and select type (movie or game).');
      return;
    }

    const itemData = {
      type,
      title: title.trim(),
      details: details.trim(),
    };

    try {
      const response = await axios.post('http://localhost:5000/api/wishlist/add', itemData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Item added:', response.data);
      setTitle('');
      setDetails('');
      setType('');
      setIsModalOpen(false); // Close modal after submitting the item
    } catch (error) {
      console.error('Error adding item:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div>
      {/* Popup Modal */}
      {isModalOpen && (
        <div className="wishlist-popup-overlay">
          <div className="wishlist-popup">
            <h1>Add Item to Wishlist</h1>
            <form onSubmit={handleSubmit} className="wishlist-form">
              <div className="checkbox-container">
                <label>
                  <input
                    type="checkbox"
                    value="movie"
                    checked={type === 'movie'}
                    onChange={handleCheckboxChange}
                  />
                  Movie
                </label>
                <label>
                  <input
                    type="checkbox"
                    value="game"
                    checked={type === 'game'}
                    onChange={handleCheckboxChange}
                  />
                  Game
                </label>
              </div>
              <div>
                <label>
                  Title:
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </label>
              </div>
              <div>
                <label>
                  Details:
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </label>
              </div>
              <div className="button-container">
                <button type="submit" className="submit-button">Add Item</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="close-button">Close</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishList;
