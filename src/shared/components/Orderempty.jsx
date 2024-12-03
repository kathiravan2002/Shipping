import React from 'react';

const Orderempty = () => {
    return (
        <tr>
            <td className="px-4 py-8 text-center" colSpan={9}>
                <div className="flex flex-col items-center gap-4">
                    <img
                        src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=300&h=300"
                        alt="Empty orders"
                        className="w-48 h-48 object-contain"
                    />
                    <p className="text-gray-500">Add your first order to get started</p>
                    <div className="flex gap-4">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">
                            Add order
                        </button>
                        <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50">
                            Sync Website Orders
                        </button>
                    </div>
                </div>
            </td>
        </tr>
    );
};

export default Orderempty;