import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import { ChakraProvider, Tooltip } from "@chakra-ui/react";
import { motion } from "framer-motion";
import Head from "next/head";
import Image from "next/image";
import { Icon } from '@chakra-ui/react'
import { FaAsterisk } from 'react-icons/fa'
import React, { useCallback, useMemo, useState } from "react";
import { inferQueryResponse } from './api/trpc/[trpc]';

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);


  const voteForRoundest = (selected: number) => {
    updateIds(getOptionsForVote());
  };

  return (
    <ChakraProvider>
      <div className="flex flex-col items-center justify-center w-screen h-screen">
        <div className="text-2xl text-center cursor-default">
          Which Pokemon is more OP
          <Tooltip placement="top" hasArrow label="Overpowered" aria-label="A tooltip">
            <motion.div whileHover={{ scale: 1.7 }} className="inline text-rose-700"><Icon as={FaAsterisk} className="mb-5" w={5} h={3} /></motion.div>
          </Tooltip>
          ?
        </div>
        <div className="p-2"></div>
        <div className="flex items-center justify-between max-w-2xl p-4 border rounded shadow-2xl shadow-slate-600">
          {!firstPokemon.isLoading &&
            firstPokemon.data &&
            !secondPokemon.isLoading &&
            secondPokemon.data &&
            (
              <>
                <PokemonListing pokemon={firstPokemon.data} vote={() => voteForRoundest(first)} />
                <div className="p-8">Vs</div>
                <PokemonListing pokemon={secondPokemon.data} vote={() => voteForRoundest(second)} />
              </>
            )}
        </div>
      </div>
    </ChakraProvider>
  );
}

type PokemonFromServer = inferQueryResponse<"get-pokemon-by-id">

const PokemonListing: React.FC<{ pokemon: PokemonFromServer, vote: () => void }> = ({ pokemon, vote }) => {

  const PokemonImg = pokemon.sprites.front_default;
  const PokemonName = pokemon.name;

  function HandleVote() {
    vote()
  }

  return (<div className="flex flex-col items-center justify-center w-3/4 h-3/4">
    <img src={PokemonImg} className="w-6/6" />
    <div className="text-xl text-center capitalize cursor-default">
      {PokemonName}
    </div>
    <div className="p-2"></div>
    <button
      className="text-black bg-white btn hover:bg-gray-700 hover:text-white"
      onClick={vote}
    >
      OP
    </button>
  </div>)
}