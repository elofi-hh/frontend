import Web3 from 'web3';
const web3 = new Web3('http://192.168.2.145:7545');
const contractABI = [
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'initialKFactor',
        type: 'uint16'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint16',
        name: 'newKFactor',
        type: 'uint16'
      }
    ],
    name: 'KFactorUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'userId',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'rank',
        type: 'uint16'
      }
    ],
    name: 'RankingUpdated',
    type: 'event'
  },
  {
    inputs: [],
    name: 'K_FACTOR',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'userId',
        type: 'string'
      }
    ],
    name: 'getRanking',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string'
      }
    ],
    name: 'rankings',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'newKFactor',
        type: 'uint16'
      }
    ],
    name: 'setKFactor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'userId',
        type: 'string'
      },
      {
        internalType: 'uint16',
        name: 'rank',
        type: 'uint16'
      }
    ],
    name: 'setRanking',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'userId',
        type: 'string'
      },
      {
        internalType: 'uint16',
        name: 'networkEloRating',
        type: 'uint16'
      },
      {
        internalType: 'bool',
        name: 'isAbuser',
        type: 'bool'
      }
    ],
    name: 'updateRanking',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
];

const contractAddress = '0x8c4C0114C20bbf16B3bD61CA0E0179E80E4c3454';

const contract = new web3.eth.Contract(contractABI, contractAddress);

async function setRanking(userId, newRank) {
  const accounts = await web3.eth.getAccounts();
  await contract.methods
    .setRanking(userId, newRank)
    .send({ from: accounts[0] });
}

async function setKFactor(K_FACTOR) {
  const accounts = await web3.eth.getAccounts();
  await contract.methods.setKFactor(newKFactor).send({ from: accounts[0] });
}

export const getEloRanking = async (userId) => {
  try {
    const ranking = await contract.methods.getRanking(userId).call();
    return ranking.toString(); // Ensure ranking is always a string
  } catch (error) {
    console.error('Error fetching ELO ranking:', error);
    return 'N/A'; // Return 'N/A' if there's an error
  }
};

// Update ranking for a specific user (if needed)
export const updateEloRanking = async (userId, newRank) => {
  const accounts = await web3.eth.getAccounts();
  try {
    await contract.methods
      .setRanking(userId, newRank)
      .send({ from: accounts[0] });
    console.log(`ELO ranking updated for ${userId}`);
  } catch (error) {
    console.error('Error updating ELO ranking:', error);
  }
};
