import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Dappazon from './abis/Dappazon.json'

// Config
import config from './config.json'

function App() {  
  const [account, setAccount] = useState(null)

  const [provider, setProvider] = useState(null)

  const [electronics, setElectronics] = useState(null)
  const [clothing, setClothing] = useState(null)
  const [toys, setToys] = useState(null)

  const togglePop = () => {
    console.log("toggle pop...")
  }

  const loadBlockchainData = async () => {
    // connect to Blockchaiun
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    console.log(network)

    // connect to smart contracts
    const dappazon = new ethers.Contract(
      config[network.chainId].dappazon.address,
      Dappazon,
      provider
    )

    // Load products

    const items = []

    for (let i = 0; i < 9; i++) {
      const item = await dappazon.items(i + 1)
      items.push(item)
      // console.log(item) // single item
    }

    const electronics = items.filter((item) => item.category === 'electronics')
    const clothing = items.filter((item) => item.category === 'clothing')
    const toys = items.filter((item) => item.category === 'toys')
   
    setElectronics(electronics)
    setClothing(clothing)
    setToys(toys)
  }

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount}/>

      <h2>Dappazon Best Sellers</h2>

      {electronics && clothing && toys && (
      <>
        <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop} />
        <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop} />
        <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop} />
      </>
      )}
    </div>
  );
}

export default App;
