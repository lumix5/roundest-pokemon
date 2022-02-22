import { getOptionsForVote } from "@/utils/getRandomPokemon";
import { trpc } from "@/utils/trpc";
import Head from "next/head";
import Image from "next/image";
import { useCallback, useMemo, useState } from "react";

export default function Home() {
  const [ids, updateIds] = useState(() => getOptionsForVote());

  const [first, second] = ids;

  const firstPokemon = trpc.useQuery(["get-pokemon-by-id", { id: first }]);
  const secondPokemon = trpc.useQuery(["get-pokemon-by-id", { id: second }]);

  if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

  const firstPokemonImg = firstPokemon.data[1].front_default;
  const firstPokemonName = firstPokemon.data[0];

  const secondPokemonImg = secondPokemon.data[1].front_default;
  const secondPokemonName = secondPokemon.data[0];

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <div className="text-2xl text-center">Which Pokemon is more OP?</div>
      <div className="p-2"></div>
      <div className="border rounded p-4 flex justify-between items-center max-w-2xl">
        <div className="w-64 h-64  flex flex-col  items-center">
          <img src={firstPokemonImg} className="w-5/6 " />
          <div className="text-xl text-center capitalize">{firstPokemonName}</div>
        </div>
        <div className="p-8">Vs</div>
        <div className="w-64 h-64  flex flex-col  items-center">
          <img src={secondPokemonImg} className="w-5/6 " />
          <div className="text-xl text-center capitalize">{secondPokemonName}</div>
        </div>
      </div>
    </div>
  );
}
