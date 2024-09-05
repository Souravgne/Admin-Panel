import React from 'react'
"use client";

import { Spinner } from "flowbite-react";

function Loader() {
  return (
    <div className="text-center ">
        <Spinner aria-label="Center-aligned spinner example" />
      </div>
  )
}

export default Loader