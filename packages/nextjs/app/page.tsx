"use client";

import React, { useState, useEffect } from 'react';

const BlockchainDashboard = () => {
  const [activeTab, setActiveTab] = useState('contracts');
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [contracts, setContracts] = useState([]);

  // Mock blockchain data - replace with real Web3 calls
  useEffect(() => {
    // Mock recent blocks
    setBlocks([
      { number: 1245, hash: '0x1a2b3c4d...', timestamp: Date.now() - 30000, txCount: 4, gasUsed: '21000' },
      { number: 1244, hash: '0x5e6f7g8h...', timestamp: Date.now() - 60000, txCount: 2, gasUsed: '42000' },
      { number: 1243, hash: '0x9i0j1k2l...', timestamp: Date.now() - 90000, txCount: 7, gasUsed: '158000' },
    ]);

    // Mock recent transactions
    setTransactions([
      {
        hash: '0xabcd1234...',
        from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        value: '0.1',
        gasUsed: '21000',
        status: 'success',
        timestamp: Date.now() - 15000,
        method: 'registerProject'
      },
      {
        hash: '0xefgh5678...',
        from: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
        to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        value: '0.0',
        gasUsed: '45000',
        status: 'success',
        timestamp: Date.now() - 45000,
        method: 'markUnderReview'
      },
      {
        hash: '0xijkl9012...',
        from: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
        to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        value: '0.0',
        gasUsed: '32000',
        status: 'failed',
        timestamp: Date.now() - 75000,
        method: 'updateProjectStatus'
      }
    ]);

    // Deployed Carbon Registry Contract
    setContracts([
      {
        name: 'AquaChain Blue Carbon Registry',
        address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        deployedAt: Date.now() - 3600000,
        txCount: 156,
        balance: '0.0',
        functions: ['registerProject', 'submitForVerification', 'markUnderReview', 'verifyProject', 'rejectProject', 'markProjectCompleted', 'authorizeVerifier']
      }
    ]);
  }, []);

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const formatAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-400">AquaChain Blue Carbon Registry</h1>
              <p className="text-gray-400 text-sm">DeSci Platform for Coastal Carbon Verification</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">Latest Block</div>
                <div className="font-mono text-green-400">#{blocks[0]?.number || 0}</div>
              </div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm">Total Blocks</div>
            <div className="text-2xl font-bold text-blue-400">1,245</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm">Total Transactions</div>
            <div className="text-2xl font-bold text-green-400">8,932</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm">Active Contracts</div>
            <div className="text-2xl font-bold text-purple-400">{contracts.length}</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <div className="text-gray-400 text-sm">Carbon Projects</div>
            <div className="text-2xl font-bold text-orange-400">23</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'contracts', label: 'Smart Contracts' },
              { id: 'transactions', label: 'Recent Transactions' },
              { id: 'blocks', label: 'Latest Blocks' },
              { id: 'projects', label: 'Carbon Projects' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Smart Contracts Tab */}
        {activeTab === 'contracts' && (
          <div className="space-y-4">
            {contracts.map((contract, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-blue-400">{contract.name}</h3>
                    <p className="text-gray-400 font-mono text-sm">{contract.address}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Deployed</div>
                    <div className="text-sm text-green-400">{formatTime(contract.deployedAt)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-gray-400 text-sm">Transactions</div>
                    <div className="text-lg font-semibold">{contract.txCount}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Balance</div>
                    <div className="text-lg font-semibold">{contract.balance} ETH</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Functions</div>
                    <div className="text-lg font-semibold">{contract.functions.length}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-400 mb-2">Available Functions:</div>
                  <div className="flex flex-wrap gap-2">
                    {contract.functions.map((func, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-700 rounded-full text-xs font-mono text-cyan-300">
                        {func}()
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Transaction Hash
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Age
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {transactions.map((tx, index) => (
                    <tr key={index} className="hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-blue-400">
                        {formatAddress(tx.hash)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-purple-900 text-purple-300 rounded">
                          {tx.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-300">
                        {formatAddress(tx.from)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-300">
                        {formatAddress(tx.to)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {tx.value} ETH
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          tx.status === 'success' 
                            ? 'bg-green-900 text-green-300' 
                            : 'bg-red-900 text-red-300'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        {formatTime(tx.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Blocks Tab */}
        {activeTab === 'blocks' && (
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <h3 className="text-lg font-semibold text-blue-400">Block #{block.number}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-gray-700 text-gray-300 rounded">
                        {block.txCount} transactions
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <div className="text-gray-400 text-sm">Hash</div>
                        <div className="font-mono text-sm text-gray-300">{block.hash}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Gas Used</div>
                        <div className="text-sm text-gray-300">{block.gasUsed}</div>
                      </div>
                      <div>
                        <div className="text-gray-400 text-sm">Mined</div>
                        <div className="text-sm text-green-400">{formatTime(block.timestamp)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Carbon Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            {[
              {
                id: '0x001',
                name: 'Sundarbans Mangrove Conservation Project',
                location: 'West Bengal, India',
                area: '125 hectares',
                status: 'Verified',
                carbonCredits: '450 tCO2e',
                registrant: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
                ecosystem: 'Mangrove Forest'
              },
              {
                id: '0x002',
                name: 'Puerto Rico Seagrass Restoration',
                location: 'Vieques Island, Puerto Rico',
                area: '85 hectares',
                status: 'Under Review',
                carbonCredits: 'Pending',
                registrant: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
                ecosystem: 'Seagrass Meadow'
              },
              {
                id: '0x003',
                name: 'Great Barrier Reef Coral Protection',
                location: 'Queensland, Australia',
                area: '200 hectares',
                status: 'Pending',
                carbonCredits: '0 tCO2e',
                registrant: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
                ecosystem: 'Coral Reef'
              }
            ].map((project, index) => (
              <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-green-400">{project.name}</h3>
                    <p className="text-gray-400">{project.location} • {project.area}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    project.status === 'Verified' 
                      ? 'bg-green-900 text-green-300'
                      : 'bg-yellow-900 text-yellow-300'
                  }`}>
                    {project.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">Project ID</div>
                    <div className="font-mono text-sm text-blue-400">{project.id}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Carbon Credits</div>
                    <div className="text-sm text-orange-400 font-semibold">{project.carbonCredits}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Registrant</div>
                    <div className="font-mono text-sm text-gray-300">{formatAddress(project.registrant)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockchainDashboard;