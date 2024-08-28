import { useState, useEffect } from 'react'
import {getPokemonsUrl, getData, fetchPokemonsInBatches} from './fetchFns'
// import Input from './components/Input'

// https://pokeapi.co/api/v2/
/**
 * Play with api see what it gives back 
 * build the input 
 * make that input controlled with useState
 * fetch the data from the api with the str in the input (useEffect)
 * display the data we get back 
 */

// 2. Display the following information for the searched Pokémon:
//    - Name
//    - Image (sprite)
//    - Type(s)
//    - Height and Weight
//    - At least 3 base stats (e.g., HP, Attack, Defense)
// 3. Show a list of at least 5 moves that the Pokémon can learn.
// 4. Implement error handling for invalid Pokémon names/IDs or API failures.
// 5. Make the UI responsive and visually appealing.

function App() {
  const [value, setValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const [pokemons, setPokemons] = useState<any>([])
  const filtered = pokemons.filter((pokemon:any) => {
    const nameMatch = pokemon.name.toLowerCase().includes(value?.toLowerCase());
    const idMatch = !isNaN(parseInt(value)) && pokemon.id === parseInt(value)
    
    return nameMatch || idMatch
  })
  
  useEffect(() => {
    async function getPokemonData(){
      setLoading(true)
      try{
        const pokemonsInfo = await fetchPokemonsInBatches()
        setLoading(false)
        setError(false)
        setPokemons(pokemonsInfo);
      }catch(err){
        setLoading(false) 
        setError(true)
      }
    }

    getPokemonData();
  }, [])

  return (
    <div className='flex items-center justify-center flex-col mt-10 max-w-[1400px] mx-auto'>
      <input 
        type="text" className="border border-black w-[90%] md:w-[50%] p-2 text-sm rounded-lg"
        defaultValue={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder = 'Digits 1 - 1000 or Search...'
      />

       {(!loading && pokemons.length > 0) && <p>Results: {filtered.length}</p>}

        {error && <h2>Network Error</h2> }

        {loading ? <h2>Loading ...</h2> : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-center items-center gap-3 p-5'>
            {filtered.map((pokemon: any) => {
              return (
                <div key={pokemon.id} className='border rounded-lg shadow-sm shadow-black w-full'>
                  <div className='w-full h-[50%]'>
                    <img src={pokemon.sprites?.front_default} alt={pokemon?.name} className='w-full h-full'/>
                  </div>
                  <div className='grid grid-cols-2 justify-center items-center px-2'>
                    <div className='text-md'>
                      <h1>Name : {pokemon.name}</h1>
                      <h2>
                        Type : 
                        {pokemon.types?.map((type:any, i: number) => <span key={i} className='mx-1'>{type.type.name}</span>)}
                      </h2>
                      <h2>Height: {pokemon.height}</h2>
                      <h2>Weight: {pokemon.weight}</h2>
                      <h2>HP : {pokemon.stats[0].base_stat}</h2> 
                      <h2>Attack : {pokemon.stats[1].base_stat}</h2>
                      <h2>Defense : {pokemon.stats[2].base_stat}</h2>
                    </div>

                    <div className=''>
                      <h2>Moves: </h2>
                      <ul className='list-disc ml-5'>
                        {pokemon?.moves.slice(0,5).map((move, i) => <li key={i} className='mx-1'>{move.move.name}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
    </div>
  )
}

export default App
