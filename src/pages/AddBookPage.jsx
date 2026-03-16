import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookService } from '../services/bookService';

export const AddBookPage = () => {
    const navigate = useNavigate();
    const [book, setBook] = useState({
        title: '', genre: '', description: '', publicationDate: '', authorNames: ['']
    });
    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleCoverSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setCoverFile(file);
        setCoverPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const filtered = { ...book, authorNames: book.authorNames.filter(a => a.trim()) };
            const created = await bookService.createBook(filtered);
            if (coverFile && created?.id) {
                await bookService.uploadCover(created.id, coverFile);
            }
            navigate('/books');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create book.');
        } finally {
            setLoading(false);
        }
    };

    const updateAuthor = (i, val) => {
        const a = [...book.authorNames]; a[i] = val;
        setBook({ ...book, authorNames: a });
    };

    const colors = ['bg-blue-100','bg-green-100','bg-pink-100','bg-purple-100','bg-amber-100','bg-teal-100'];
    const previewColor = colors[Math.floor(Math.random() * colors.length)];

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Add New Book</h1>
                <p className="text-sm text-gray-400 mt-1">It will be reviewed by a moderator before publishing</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
            )}

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Cover upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                        <div className="flex items-start gap-4">
                            <div
                                onClick={() => fileInputRef.current.click()}
                                className={`w-24 h-32 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer border-2 border-dashed transition-colors
                                    ${coverPreview ? 'border-transparent' : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}`}
                            >
                                {coverPreview ? (
                                    <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-center p-2">
                                        <div className="text-2xl text-gray-300 mb-1">+</div>
                                        <span className="text-xs text-gray-400">Upload</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 pt-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleCoverSelect}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    Click the area to upload a cover image.<br />
                                    Supported formats: JPG, PNG, WebP.<br />
                                    Optional — can be added later.
                                </p>
                                {coverFile && (
                                    <div className="mt-2 flex items-center gap-2">
                                        <span className="text-xs text-green-600 font-medium">✓ {coverFile.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                                            className="text-xs text-gray-400 hover:text-gray-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-50 pt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input type="text" value={book.title}
                                   onChange={e => setBook({ ...book, title: e.target.value })}
                                   className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                   required placeholder="Book title" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                        <select value={book.genre} onChange={e => setBook({ ...book, genre: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                required>
                            <option value="">Select genre</option>
                            {['Fiction','Non-Fiction','Science Fiction','Fantasy','Mystery','Romance','Thriller','Horror','Classic'].map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={book.description}
                                  onChange={e => setBook({ ...book, description: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 resize-none"
                                  rows={4} placeholder="Short description..." />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
                        <input type="date" value={book.publicationDate}
                               onChange={e => setBook({ ...book, publicationDate: e.target.value })}
                               className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400" />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Authors</label>
                            <button type="button"
                                    onClick={() => setBook({ ...book, authorNames: [...book.authorNames, ''] })}
                                    className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                                + Add author
                            </button>
                        </div>
                        <div className="space-y-2">
                            {book.authorNames.map((name, i) => (
                                <div key={i} className="flex gap-2">
                                    <input type="text" value={name}
                                           onChange={e => updateAuthor(i, e.target.value)}
                                           className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                                           required placeholder="Author name" />
                                    {book.authorNames.length > 1 && (
                                        <button type="button"
                                                onClick={() => setBook({ ...book, authorNames: book.authorNames.filter((_, j) => j !== i) })}
                                                className="text-gray-300 hover:text-gray-500 px-2 transition-colors">✕</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-2 border-t border-gray-50">
                        <button type="button" onClick={() => navigate('/books')}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading}
                                className="px-5 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-60">
                            {loading ? 'Submitting...' : 'Submit for Review'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookPage;