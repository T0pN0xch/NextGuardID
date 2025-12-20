const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing Hardhat + Ethers.js setup...");
  
  // Test 1: Get signers
  const signers = await hre.ethers.getSigners();
  console.log("✅ Signers available:", signers.length);
  
  // Test 2: Check first signer balance
  const provider = hre.ethers.provider;
  const balance = await provider.getBalance(signers[0].address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "MATIC");
  
  // Test 3: Check network
  const network = await provider.getNetwork();
  console.log("🌐 Network:", network.name, "Chain ID:", network.chainId);
  
  // Test 4: Compile contract
  console.log("📄 Checking contract...");
  try {
    await hre.run("compile");
    console.log("✅ Contract compiles successfully");
  } catch (e) {
    console.log("❌ Compile error:", e.message);
  }
}

main();