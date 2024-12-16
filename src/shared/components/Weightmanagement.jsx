import React, { useState } from 'react';

const Weightmanagement = () => {
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [mass, setMass] = useState('');
    const [volumetricWeight, setVolumetricWeight] = useState(null);

    const calculateVolumetricWeight = () => {
        if (length && width && height) {
            const volumetric = (length * width * height) / 5000;
            setVolumetricWeight(volumetric.toFixed(2)); // Rounding to 2 decimals
        } else {
            alert('Please enter valid dimensions.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-md place-self-center text-center">
            <h1 className =" text-red-400 font-extrabold  border-b-[0.5px] border-gray-700 ">Weight and Dimensions Calculator</h1>
            <div className='py-5'>
                <label>
                    Length (cm):
                    <input
                        type="number"
                        value={length}
                        className="p-2 border rounded  "
                        onChange={(e) => setLength(e.target.value)}
                    />
                </label>
            </div>
            <div className='py-5'>
                <label>
                    Width (cm):
                    <input
                        type="number"
                        value={width}
                        className="p-2 border rounded "
                        onChange={(e) => setWidth(e.target.value)}
                    />
                </label>
            </div>
            <div className='py-5'>
                <label>
                    Height (cm):
                    <input
                        type="number"
                        value={height}
                        className="p-2 border rounded "
                        onChange={(e) => setHeight(e.target.value)}
                    />
                </label>
            </div>
            <div className='py-5'>
                <label>
                    Mass (kg): 
                    <input
                        type="number"
                        value={mass}
                        className="p-2 border rounded "
                        onChange={(e) => setMass(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={calculateVolumetricWeight}  className="bg-gradient-to-r from-purple-600 to-green-500  hover:from-green-500 hover:to-purple-600 text-white px-4 py-2 rounded ">
                Calculate
            </button>
            <div style={{ marginTop: '20px' }}>
                {volumetricWeight !== null && (
                    <div>
                        <p><strong>Volumetric Weight:</strong> {volumetricWeight} kg</p>
                        <p><strong>Actual Weight:</strong> {mass ? `${mass} kg` : 'Enter mass'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Weightmanagement;