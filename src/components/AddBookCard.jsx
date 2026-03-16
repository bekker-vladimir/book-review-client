import React from 'react';
import {Link} from 'react-router-dom';
import {Plus} from 'lucide-react';

export const AddBookCard = () => {
    return (
        <Link to="/books/add">
            <div className="flex flex-col h-full bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="mb-4 p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                        <Plus size={32} className="text-blue-500"/>
                    </div>
                    <h3 className="text-xl font-bold mb-1 text-blue-500"> Add New Book </h3>
                </div>
            </div>
        </Link>
    );
};

export default AddBookCard;