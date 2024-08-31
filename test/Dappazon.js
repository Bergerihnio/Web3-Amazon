const { expect } = require("chai")

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ID = 1
const NAME =  "Shoes"
const CATEGORY = "Clothing"
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg"
const COST = tokens(1)
const RATING = 4
const STOCK = 5

describe("Dappazon", () => {
  let dappazon
  let deployer, buyer 

  beforeEach(async () => {
    // Setup Accounts
    [deployer, buyer] = await ethers.getSigners()

    // Deploy contract
    const Dappazon = await ethers.getContractFactory("Dappazon")
    dappazon = await Dappazon.deploy()
  })

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await dappazon.owner()).to.equal(deployer.address)
    })

    // it('has a name', async () => {
    //   const Dappazon = await ethers.getContractFactory("Dappazon")
    //   dappazon = await Dappazon.deploy()
    //   expect(await dappazon.name()).to.equal("Dappazon");
    // })
  })

  describe("Listing", () => {
    let transaction

    beforeEach(async () => {
      transaction = await dappazon.connect(deployer).list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);

      await transaction.wait()

      // buy an item
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST })
    })

    // it("Emits List event", () => {
    //   expect(transaction).to.emit(dappazon, "List")
    // })

    it("Updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address)
      console.log(result)
      expect(result).to.equal(COST)
    })

    it("Update buyer's order count", async () => {
      const result = await dappazon.orderCount(buyer.address)
      expect(result).to.equal(1)
    })

    it("Adds the order", async () => {
      const order = await dappazon.orders(buyer.address, 1)

      expect(order.time).to.be.greaterThan(0)
      expect(order.time.name).to.equal(NAME)
    })

  })
})