import React from 'react';

export default function Card({ title, value, percentage, icon: Icon, bgColor }) {
  return (
    <div className={`${bgColor} text-white rounded-lg shadow-md p-6`}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-4xl font-bold mt-2">{value}</p>
          <p className="text-sm mt-1">{percentage}</p>
        </div>
        <Icon size={40} />
      </div>
    </div>
  );
}