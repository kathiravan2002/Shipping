
import React, { useState } from 'react';

const Addorder = () => {
  const [formData, setFormData] = useState({
    name: 'sathish',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Update the appropriate field
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default browser behavior
    console.log('Form Data Submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        value={formData.name} // Controlled component
        onChange={handleChange} // Update state on change
      />

      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={formData.email} // Controlled component
        onChange={handleChange} // Update state on change
      />

      <button type="submit">Submit</button>
    </form>
  );
};


export default Addorder;