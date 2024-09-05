"use client";

import { Card } from "flowbite-react";
import React from 'react';

function Cards({ title, count }) {
  return (
    <div className="w-80 h-48 flex items-center justify-center">
      <Card href="#" className="w-full h-[90%] m-4 flex flex-col items-center justify-center text-center">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="font-semibold text-2xl text-gray-700 dark:text-gray-400">
          {count}
        </p>
      </Card>
    </div>
  );
}

export default Cards;
