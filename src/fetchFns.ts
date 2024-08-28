const POKEMON_LIST_URL = 'https://pokeapi.co/api/v2/pokemon?limit=1000';
const BATCH_SIZE = 100;

export async function getPokemonsUrl(){
  try{
    const res = await fetch(POKEMON_LIST_URL)
    const { results } = await res.json();
    const urls = results.map((result: {name: string, url: string}) => result.url)
    return urls
  }catch(err){
    if(err instanceof Error){
      console.log(`fetching urls Error : ${err.message}`)
    }
  }
}

export async function fetchPokemonsInBatches(){
  const urls = await getPokemonsUrl();
  const batches = [];

  for(let i = 0; i < urls.length; i += BATCH_SIZE){
    const batchUrls = urls.slice(i, i + BATCH_SIZE)
    const batchData = await Promise.all(batchUrls.map(getData))
    batches.push(batchData)
  }

  return batches.flat();
}

export async function getData(url : string){
  const res = await fetch(url);
  const data = await res.json();
  return data;
}