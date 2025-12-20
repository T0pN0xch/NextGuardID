const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment to Polygon Amoy...");
  
  // Get the deployer/signer
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance (Ethers v6 syntax)
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "MATIC");
  
  if (balance === 0n) {
    console.log("\n⚠️  Insufficient MATIC for deployment!");
    console.log("👉 Get test MATIC from: https://faucet.polygon.technology/");
    console.log("Network: Amoy");
    console.log("Address:", deployer.address);
    return;
  }
  
  console.log("\n📦 Deploying IdentityAudit contract...");
  
  // Deploy contract
  const IdentityAudit = await hre.ethers.getContractFactory("IdentityAudit");
  const contract = await IdentityAudit.deploy();
  
  console.log("⏳ Waiting for deployment confirmation...");
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  
  console.log("\n✅ DEPLOYMENT SUCCESSFUL!");
  console.log("📋 Contract Address:", contractAddress);
  console.log("🔗 View on Polygonscan: https://amoy.polygonscan.com/address/" + contractAddress);
  console.log("👤 Deployer:", deployer.address);
  
  // Save to file
  const fs = require("fs");
  const deploymentInfo = {
    network: "polygon-amoy",
    contractAddress: contractAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    transactionHash: contract.deploymentTransaction().hash
  };
  
  fs.writeFileSync(
    "./deployment-info.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n📁 Deployment info saved to: deployment-info.json");
  console.log("\n🎉 Ready for frontend integration!");
  console.log("Copy this address to your frontend: " + contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });