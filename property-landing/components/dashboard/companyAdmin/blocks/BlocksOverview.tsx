
/**
 * ŠTA RJEŠAVA:
 * - prikaz blokova sa njihovim nekretninama
 * - dohvat podataka sa backend-a
 * - loading i empty state
 *
 * NAPOMENA:
 * - nema edit/delete funkcionalnosti, samo prikaz
 * - koristi Tailwind CSS za stilizaciju
 */

"use client";

import { useState, useEffect } from "react";
import apiClient from "@/utils/api/apiClient";


type Property = {
  id: number;
  name: string;
};

type Block = {
  id: number;
  name: string;
  properties?: Property[];
};  

export default function BlocksOverview() {

  // state for blocks data
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

    // fetch blocks on component mount
    useEffect(() => {
      const fetchBlocks = async () => {
        try {
          const response = await apiClient.get("/properties/blocks/");
          setBlocks(response.data);
        } catch (err) {
          setError("Failed to fetch blocks");
        } finally {
          setLoading(false);
        }
      };

      fetchBlocks();
    }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (blocks.length === 0) {
    return <div>No blocks available</div>;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block) => (
        <div key={block.id} className="bg-white shadow rounded-lg p-6">
          <h2 className="text-md font-semibold">{block.name}</h2>
          <ul className="mt-4 space-y-2">
            {block.properties.map((property) => (
              <li key={property.id} className="text-gray-700 text-sm">
                {property.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
