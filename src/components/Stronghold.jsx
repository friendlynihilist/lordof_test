import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import { Nav, Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import Web3 from 'web3';
import tune from '../assets/stronghold.mp3';
import TypeWriterEffect from 'react-typewriter-effect';

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border: 1px solid black;
  background-color: var(--secondary);
  font-family: 'VCROSDMONO', monospace;
  font-size: 2rem;
  font-weight: bold;
  color: var(--secondary-text);
  width: 200px;
  cursor: pointer;
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 20px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImgBak = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const HeaderTitle = styled.span`
  text-shadow: 2px 4px var(--secondary);
  text-align: center;
  font-size: 3rem;
  color: var(--primary-text);
  font-family: 'Alagard', monospace;
  font-weight: bold;
  color: 'var(--accent-text)';
  @media (min-width: 900px) {
    font-size: 4rem;
    text-shadow: 2px 6px var(--secondary);
  }
  @media (min-width: 1000px) {
    font-size: 5.5rem;
    text-shadow: 2px 8px var(--secondary);
  }
  transition: width 0.5s;
`;

export const DivTitle = styled.span`
  text-shadow: 2px 4px var(--secondary);
  text-align: center;
  font-size: 1.6rem;
  color: var(--primary-text);
  font-family: 'Alagard', monospace;
  font-weight: bold;
  color: 'var(--accent-text)';
  @media (min-width: 900px) {
    font-size: 2rem;
  }
  @media (min-width: 1000px) {
    font-size: 2.5rem;
  }
  transition: width 0.5s;
`;

export const StyledViewer = styled.img`
  width: 250px;
  @media (min-width: 900px) {
    width: 350px;
  }
  @media (min-width: 1000px) {
    width: 60%;
  }
  @media (min-width: 1200px) {
    width: 50%;
  }
  transition: width 0.5s;
`;

export const StyledImg = styled.img`
  width: 350px;
  @media (min-width: 900px) {
    width: 550px;
  }
  @media (min-width: 1000px) {
    width: 800px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function Stronghold() {
  const [isChecking, setIsChecking] = useState(false);
  const [isDoingTransaction, setIsDoingTransaction] = useState(false);
  const [isDisplaySection, setIsDisplaySection] = useState('pool');

  const [playing, setPlaying] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audio = useRef(new Audio(tune));

  audio.current.onended = function () {
    setPlaying(false);
  };

  audio.current.onplay = function () {
    setHasError(false);
  };

  const handleClick = () => {
    setPlaying((playing) => !playing);
  };

  useEffect(() => {
    if (playing) {
      audio.current
        .play()
        .then(() => {
          // Audio is playing.
        })
        .catch((error) => {
          setHasError(true);
        });
    } else if (!hasError) {
      audio.current.pause();
    }
  }, [playing, hasError]);

  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: '',
    SCAN_LINK: '',
    NETWORK: {
      NAME: '',
      SYMBOL: '',
      ID: 0,
    },
    NFT_NAME: '',
    SYMBOL: '',
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: '',
    MARKETPLACE_LINK: '',
    SHOW_BACKGROUND: false,
  });

  const [poolsInfo, setPools] = useState(null);
  const [ownedInfo, setOwned] = useState(null);
  const [stakedInfo, setStaked] = useState(null);
  const [approvalInfo, setApproval] = useState(false);
  const [harvestXRLC, setHarvestXRLC] = useState(false);
  const [ownedXRLC, setOwnedXRLC] = useState(false);

  const getData = () => {
    if (blockchain.account !== '' && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch('/config/config.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  const testEventsListening = async () => {
    blockchain.smartContract.events
      .allEvents()
      .on('data', async function (event) {
        console.log(event.returnValues);
        // Do something here
      })
      .on('error', console.error);
  };

  const updateDisplaySection = async (_pid) => {
    setIsDisplaySection(_pid);
  };

  function AlertDismissible() {
    const [show, setShow] = useState(true);

    return (
      <>
        <Alert
          key="alert-1"
          show={show}
          style={{
            backgroundColor: 'var(--primary-dark)',
            color: 'white',
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            width: '18rem',
            zIndex: '9999',
            borderRadius: '10px',
            // transition: 'opacity 2s ease-in'
            // border: '1px solid white'
          }}
        >
          {/* <Alert.Heading>{feedback}</Alert.Heading> */}
          <p>{feedback}</p>
          <hr />
          <div className="d-flex justify-content-end">
            <StyledButton
              key="alert-btn-1"
              style={{
                fontSize: '1.2rem',
                fontWeight: 'normal',
                width: 'auto',
              }}
              onClick={() => setShow(false)}
            >
              Close
            </StyledButton>
          </div>
        </Alert>

        {/* {!show && <Button onClick={() => setShow(true)}>Show Alert</Button>} */}
      </>
    );
  }

  const testWithdraw = async (_pid, _tokenIds) => {
    setFeedback(`You're calling back your NFT from the quest...`);
    setIsDoingTransaction(true);
    await blockchain.smartContract.methods
      .withdraw(_pid, _tokenIds)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account.toLowerCase(),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        type: '0x2',
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Oops, something went wrong. Please try again later.');
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`Your NFT is back home!`);
        dispatch(fetchData(blockchain.account));
        testPoolInfo();
        setIsDoingTransaction(false);
      });
  };

  const testDeposit = async (_pid, _tokenIds) => {
    console.log(_tokenIds);
    setFeedback(`You're sending your NFT to a quest...`);
    setIsDoingTransaction(true);
    await blockchain.smartContract.methods
      .deposit(_pid, _tokenIds)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account.toLowerCase(),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        type: '0x2',
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Oops, something went wrong. Please try again later.');
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`Your NFT is departed for a quest!`);
        dispatch(fetchData(blockchain.account));
        testPoolInfo();
        setIsDoingTransaction(false);
      });
  };

  const testWithdrawAll = async (_pid, pool) => {
    setFeedback(`You're calling back all your NFTs from the quest...`);
    setIsDoingTransaction(true);

    let stakedIdsArray = [];
    for (let i of pool.stakedNfts.info) {
      stakedIdsArray.push(parseInt(i.tokenId));
    }

    await blockchain.smartContract.methods
      .withdraw(_pid, stakedIdsArray)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account.toLowerCase(),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        type: '0x2',
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Oops, something went wrong. Please try again later.');
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`Your NFTs are back home!`);
        dispatch(fetchData(blockchain.account));
        testPoolInfo();
        setIsDoingTransaction(false);
      });
  };

  const testDepositAll = async (_pid, pool) => {
    setFeedback(`You're sending all your NFTs to a quest...`);
    setIsDoingTransaction(true);

    let ownedIdsArray = [];
    for (let i of pool.ownedNfts.info) {
      ownedIdsArray.push(parseInt(i.tokenId));
    }

    await blockchain.smartContract.methods
      .deposit(_pid, ownedIdsArray)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account.toLowerCase(),
        // value: totalBN.toString(),
        maxPriorityFeePerGas: 230538200000,
        maxFeePerGas: 230538200000,
        type: '0x2',
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Oops, something went wrong. Please try again later.');
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`Your NFTs are departed for a quest!`);
        dispatch(fetchData(blockchain.account));
        testPoolInfo();
        setIsDoingTransaction(false);
      });
  };

  const testHarvest = async (_pid) => {
    setFeedback(`You're collecting your loot...`);
    setIsDoingTransaction(true);
    await blockchain.smartContract.methods
      .harvest(_pid)
      .send({
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account.toLowerCase(),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        type: '0x2',
      })
      .once('error', (err) => {
        console.log(err);
        setFeedback('Sorry, something went wrong please try again later.');
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(`You've harvested!`);
        dispatch(fetchData(blockchain.account));
        testPoolInfo();
        setIsDoingTransaction(false);
      });
  };

  const testSetApprovalForAll = async (_pid) => {
    setFeedback(`You're approving this collection...`);
    setIsDoingTransaction(true);
    const poolInfo = await blockchain.smartContract.methods // return nftToken (nft collection address); allocPoint; lastRewardTime; accLootPerShare
      .poolInfo(_pid)
      .call();

    const abiResponse = await fetch('/config/abi_ftl.json', {
      //abi_ftl1.json
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const poolAbi = await abiResponse.json();
    const nftAddress = poolInfo.nftToken.toLowerCase(); // take the nft collection address

    const web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const poolContract = new web3.eth.Contract(poolAbi, nftAddress);

    await poolContract.methods
      .setApprovalForAll(CONFIG.CONTRACT_ADDRESS.toLowerCase(), true)
      .send({
        // to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account.toLowerCase(),
        maxPriorityFeePerGas: null,
        maxFeePerGas: null,
        type: '0x2',
      });
    setApproval(true);
    testPoolInfo();
    setIsDoingTransaction(false);
  };

  // const createOwnedArray = async (pool) => {
  //   let ownedIdsArray = [];
  //   for (let i of pool.ownedNfts.info) {
  //     ownedIdsArray.push(parseInt(i.tokenId));
  //   }
  //   console.log(ownedIdsArray);
  //   return ownedIdsArray;
  // }

  // const createStakedArray = async (pool) => {
  //   let stakedIdsArray = [];
  //   for (let i of pool.stakedNfts.info) {
  //     stakedIdsArray.push(parseInt(i.tokenId));
  //   }
  //   return stakedIdsArray;
  // }

  // let retryCall = 0;

  const testPoolInfo = async () => {
    setIsChecking(true);
    const poolLength = await blockchain.smartContract.methods //how many pools have been set
      .poolLength()
      .call();
    let idsArray = []; //4
    let poolArray = [];
    if (poolLength) {
      for (let index = 0; index < poolLength; index++) {
        idsArray.push(index);
      }
    }

    //
    //
    // WARNING: REMOVE ASCENDED LORDS!
    //
    //

    // idsArray.splice(3, 1);

    //
    //
    // WARNING: REMOVE ASCENDED LORDS!
    //
    //
    try {
      await Promise.all(
        idsArray.map(async (_pid) => {
          const address = blockchain.account.toLowerCase();
          const poolInfo = await blockchain.smartContract.methods // return nftToken (nft collection address); allocPoint; lastRewardTime; accLootPerShare
            .poolInfo(_pid)
            .call();
          const userInfo = await blockchain.smartContract.methods // return amount (amount of owned nfts from the pool); rewardDebt
            .userInfo(_pid, address)
            .call();
          const pendingXrlc = await blockchain.smartContract.methods // pending loot
            .pendingXrlc(_pid, address)
            .call();
          const stakedNfts = userInfo.amount; // the amount of staked nft in that pool
          let stakedNftsIndex = []; // will store all the nfts index of the collection contract (only the staked ones)
          if (stakedNfts) {
            const amountArray = Array.apply(null, { length: stakedNfts }).map(
              Number.call,
              Number
            ); // create an array with the number of staked nfts. e.g. if stakedNfts = 3 => amountArray = [0,1,2]
            try {
              await Promise.all(
                amountArray.map(async (_tid) => {
                  const nftIndex = await blockchain.smartContract.methods // return the nft index of the collection contract (bc it can differ from the index of the staking platform)
                    .tokenOfOwnerByIndex(_pid, address, _tid)
                    .call();
                  stakedNftsIndex.push(nftIndex);
                })
              );
            } catch (error) {
              console.log(error);
            }
          }

          // NFTS VIEWER FUNCTION //
          const abiResponse = await fetch('/config/abi_ftl.json', {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });
          const poolAbi = await abiResponse.json();
          const nftAddress = poolInfo.nftToken.toLowerCase(); // take the nft collection address

          const web3 = new Web3(window.ethereum);
          await window.ethereum.enable();
          await web3.eth
            .getBlock('pending')
            .then((block) =>
              console.log('baseFee', Number(block.baseFeePerGas))
            );
          // await web3.eth.estimateGas({})-then
          const poolContract = new web3.eth.Contract(poolAbi, nftAddress);
          const poolName = await poolContract.methods.name().call();
          const balanceOf = await poolContract.methods
            .balanceOf(address)
            .call(); // total collection nfts owned by user (and not staked in staking platform)

          let ownedNftsInfo = [];

          // find if this nft contract has been approved
          const isApproved = await poolContract.methods
            .isApprovedForAll(
              address.toLowerCase(),
              CONFIG.CONTRACT_ADDRESS.toLowerCase()
            )
            .call();
          let poolApproval = isApproved;
          // setApproval(isApproved);
          //

          // make a fetch to the first token of the collection in order to gather the image for the pool

          // FIRST IMAGE URI

          // let poolImageUri;

          // if (_pid == 0) {
          //   poolImageUri = '/assets/1.gif';
          // } else if (_pid == 1) {
          //   poolImageUri = '/assets/enricreepto.png';
          // } else if (_pid == 2) {
          //   poolImageUri = '/assets/specter.gif';
          // } else if (_pid > 2) {
          let poolImageUri = '';

          if (_pid == 0) {
            poolImageUri = '/public/config/images/lord.gif';
          }
          if (_pid == 1) {
            poolImageUri = '/public/config/images/creeptoghoul.png';
          }
          if (_pid == 2) {
            poolImageUri = '/public/config/images/specter.gif';
          }
          if (_pid == 3) {
            poolImageUri = '/public/config/images/ascendedlord.png';
          }

          //   let firstTokenId = _pid == 0 ? 1 : 0;
          //   if (_pid == 3) {firstTokenId = 1}
          //   const firstTokenUri = await poolContract.methods
          //   .tokenURI(firstTokenId)
          //   .call();
          // const responseFT = await fetch(
          //   firstTokenUri.replace(
          //     'ipfs://',
          //     'https://nftstorage.link/ipfs/'
          //   )
          // );
          // const jsonifyRespFT = await responseFT.json();

          // let URIprefix = jsonifyRespFT.image.startsWith(
          //   'https://ipfs.io/ipfs/'
          // )
          //   ? 'https://ipfs.io/ipfs/'
          //   : 'ipfs://';

          // const poolImageUri = jsonifyRespFT.image.replace(
          //   URIprefix,
          //   'https://nftstorage.link/ipfs/'
          // );
          // }

          //

          if (balanceOf) {
            if (_pid !== 1 && _pid !== 2) {
              // if user owns not staked nfts
              const notStakedNfts = parseInt(balanceOf); // number of not staked nfts
              const totalAmountArray = Array.apply(null, {
                length: notStakedNfts,
              }).map(Number.call, Number); // create an array from the number of notStakedNfts

              try {
                await Promise.all(
                  totalAmountArray.map(async (_tid) => {
                    const poolNftIndex = await poolContract.methods
                      .tokenOfOwnerByIndex(address, _tid) // return the id of every nfts that is not staked yet
                      .call();

                    // TO DO: creating an object with staked and unstaked nfts from the collection

                    const tokenUri = await poolContract.methods
                      .tokenURI(poolNftIndex)
                      .call();
                    const response = await fetch(
                      tokenUri.replace(
                        'ipfs://',
                        'https://nftstorage.link/ipfs/'
                      )
                    );
                    let jsonifyResp = await response.json();
                    jsonifyResp.tokenId = poolNftIndex;
                    ownedNftsInfo.push(jsonifyResp);
                  })
                );
              } catch (error) {
                console.log(error);
              }
            } else if (_pid == 1 || _pid == 2) {
              if (_pid == 1) {
                let tokenIdsArray = [];
                for (let index = 0; index < 64; index++) {
                  tokenIdsArray.push(index);
                }
                try {
                  await Promise.all(
                    tokenIdsArray.map(async (_tindex) => {
                      const ownerAddress = await poolContract.methods
                        .ownerOf(_tindex)
                        .call();
                      if (
                        ownerAddress.toLowerCase() === address.toLowerCase()
                      ) {
                        const tokenUri = await poolContract.methods
                          .tokenURI(_tindex)
                          .call();
                        const response = await fetch(
                          tokenUri
                          // .replace(
                          //   'https://nftstorage.link/ipfs/',
                          //   'https://nftstorage.link/ipfs/'
                          // )
                        );
                        let jsonifyResp = await response.json();
                        jsonifyResp.tokenId = _tindex;
                        ownedNftsInfo.push(jsonifyResp);
                      }
                    })
                  );
                } catch (error) {
                  console.log(error);
                }
              } else if (_pid == 2) {
                let tokenIdsArray = [];
                for (let index = 0; index < 98; index++) {
                  tokenIdsArray.push(index);
                }
                try {
                  await Promise.all(
                    tokenIdsArray.map(async (_tindex) => {
                      const ownerAddress = await poolContract.methods
                        .ownerOf(_tindex)
                        .call();
                      if (
                        ownerAddress.toLowerCase() === address.toLowerCase()
                      ) {
                        const tokenUri = await poolContract.methods
                          .tokenURI(_tindex)
                          .call();
                        const response = await fetch(
                          tokenUri.replace(
                            'ipfs://',
                            'https://nftstorage.link/ipfs/'
                          )
                        );
                        let jsonifyResp = await response.json();
                        jsonifyResp.tokenId = _tindex;
                        ownedNftsInfo.push(jsonifyResp);
                      }
                    })
                  );
                } catch (error) {
                  console.log(error);
                }
              }
            }
          }

          let stakedNftsInfo = [];

          if (stakedNftsIndex) {
            try {
              await Promise.all(
                stakedNftsIndex.map(async (_tid) => {
                  const tokenUri = await poolContract.methods
                    .tokenURI(_tid)
                    .call();
                  const response = await fetch(
                    tokenUri.replace(
                      'ipfs://',
                      'https://nftstorage.link/ipfs/'
                    )
                  );
                  let jsonifyResp = await response.json();
                  jsonifyResp.tokenId = _tid;
                  stakedNftsInfo.push(jsonifyResp);
                })
              );
            } catch (error) {
              console.log(error);
            }
          }

          const XRLCresponse = await fetch('/config/abi_xrlc.json', {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
          });
          const XRLCAbi = await XRLCresponse.json();
          const XRLCAddress =
            '0xe5586582e1a60e302a53e73e4fadccaf868b459a'.toLowerCase();
          // const artifactsAddress = CONFIG.CONTRACT_ADDRESS.toLowerCase(); // take the nft collection address

          const XRLCContract = new web3.eth.Contract(XRLCAbi, XRLCAddress);

          const balanceOfXRLC = await XRLCContract.methods
            .balanceOf(blockchain.account.toLowerCase())
            .call();

          setOwnedXRLC(balanceOfXRLC);
          // setHarvestXRLC(harvestXRLC + pendingXrlc);

          // // //

          const poolStruct = {
            poolId: _pid,
            poolName: poolName,
            poolApproval: poolApproval,
            poolAddress: poolInfo.nftToken,
            poolPoints: poolInfo.allocPoint,
            poolImage: poolImageUri,
            pendingXrlc: pendingXrlc,
            rewardDebt: userInfo.rewardDebt,
            stakedNfts: {
              balance: stakedNfts,
              info: stakedNftsInfo,
            },
            ownedNfts: {
              balance: balanceOf,
              info: ownedNftsInfo,
            },
          };

          poolArray.push(poolStruct);
        })
      );
    } catch (err) {
      console.log(err);
      // if (retryCall < 20) {
      //   testPoolInfo();
      //   console.log(retryCall);
      //   retryCall++;
      // }
    }

    // setStaked(poolArray.stakedNfts.info);
    // setOwned(poolArray.ownedNfts.info);
    // setIsDisplaySection('pool');
    setIsChecking(false);
    setPools(poolArray);
    console.log(poolArray);
  };

  const [isActive, setActive] = useState('false');

  const handleToggle = () => {
    setActive(!isActive);
  };

  return (
    <s.Screen>
      <s.Container
        flex={1}
        ai={'center'}
        style={{ padding: 24, backgroundColor: 'var(--primary)' }}
        image={CONFIG.SHOW_BACKGROUND ? '/config/images/bg.png' : null}
      >
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={'center'}
            ai={'center'}
            style={{
              // backgroundColor: 'var(--accent)',
              padding: 24,
              borderRadius: 24,
              // border: "4px dashed var(--secondary)",
              // boxShadow: '0px 5px 11px 2px rgba(0,0,0,0.7)',
            }}
          >
            {/* <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle> */}

            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: 'center', color: 'var(--accent-text)' }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: 'center', color: 'var(--accent-text)' }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={'_blank'} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                {blockchain.account === '' ||
                blockchain.smartContract === null ? (
                  <s.Container ai={'center'} jc={'center'}>
                    <s.TextDescription
                      style={{
                        textAlign: 'center',
                        color: 'var(--accent-text)',
                      }}
                    >
                      Connect to the {CONFIG.NETWORK.NAME} network
                    </s.TextDescription>
                    <s.SpacerSmall />
                    <StyledButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                      }}
                    >
                      CONNECT
                    </StyledButton>
                    {blockchain.errorMsg !== '' ? (
                      <>
                        <s.SpacerSmall />
                        <s.TextDescription
                          style={{
                            textAlign: 'center',
                            color: 'var(--accent-text)',
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    {!poolsInfo ? (
                      <>
                        <s.Container ai={'center'} jc={'center'} fd={'row'}>
                          {!isChecking && (
                            <StyledButton
                              disabled={claimingNft ? 1 : 0}
                              onClick={(e) => {
                                e.preventDefault();
                                testEventsListening();
                                testPoolInfo();
                              }}
                            >
                              CHECK
                            </StyledButton>
                          )}
                          {isChecking && (
                            <>
                              <s.Container
                                flex={2}
                                jc={'center'}
                                ai={'center'}
                                style={{
                                  // backgroundColor: 'var(--accent)',
                                  padding: 24,
                                  borderRadius: 24,
                                  // border: "4px dashed var(--secondary)",
                                  // boxShadow: '0px 5px 11px 2px rgba(0,0,0,0.7)',
                                }}
                              >
                                <s.TextDescription
                                  style={{
                                    textAlign: 'center',
                                    color: 'var(--accent-text)',
                                    width: 'auto',
                                  }}
                                >
                                  <small className="text-muted">
                                    If the page does not load, please change
                                    network and/or{' '}
                                    <a
                                      style={{
                                        fontWeight: 'bold',
                                        color: 'var(--secondary)',
                                        cursor: 'pointer',
                                      }}
                                      onClick={() =>
                                        window.location.reload(false)
                                      }
                                    >
                                      refresh
                                    </a>
                                    . If the problem persists, try clearing your
                                    browser cache.
                                  </small>
                                </s.TextDescription>
                                <s.SpacerLarge />
                                <s.SpacerLarge />
                                <Spinner
                                  animation="border"
                                  variant="primary"
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </Spinner>
                              </s.Container>
                            </>
                          )}
                        </s.Container>
                      </>
                    ) : (
                      <>
                        {isDoingTransaction && <AlertDismissible />}
                        <s.Container flex={1} jc={'center'} ai={'center'}>
                          <StyledImg
                            alt={'Discover the Stronghold'}
                            src={'/config/images/stakingbanner.png'}
                            style={{ imageRendering: 'pixelated' }}
                          />

                          {!playing && (
                            <>
                              <s.TextDescription
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleClick();
                                }}
                                style={{
                                  textAlign: 'center',
                                  color: 'var(--accent-text)',
                                  cursor: 'pointer',
                                }}
                              >
                                play ???
                              </s.TextDescription>
                            </>
                          )}
                          {playing && (
                            <>
                              <s.TextDescription
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleClick();
                                }}
                                style={{
                                  textAlign: 'center',
                                  color: 'var(--accent-text)',
                                  cursor: 'pointer',
                                }}
                              >
                                pause ???
                              </s.TextDescription>
                            </>
                          )}

                          <s.SpacerLarge />

                          <HeaderTitle>
                            <TypeWriterEffect
                              // textStyle={{ fontFamily: 'Red Hat Display' }}
                              startDelay={100}
                              cursorColor="white"
                              hideCursorAfterText="true"
                              text="Enter the Stronghold..."
                              typeSpeed={100}
                              // scrollArea={myAppRef}
                            />
                          </HeaderTitle>
                          <s.SpacerLarge />
                          <s.SpacerLarge />
                          <s.Container
                            flex={1}
                            jc={'center'}
                            ai={'center'}
                            style={{
                              borderBottom: '1px solid var(--secondary)',
                            }}
                          >
                            <s.TextDescription
                              style={{
                                textAlign: 'center',
                                color: 'var(--accent-text)',
                              }}
                            >
                              Welcome to the Stronghold, traveler.
                            </s.TextDescription>
                            <s.TextDescription
                              style={{
                                textAlign: 'center',
                                color: 'var(--accent-text)',
                              }}
                            >
                              Send your adventurers through the depths of this
                              ancient bastion to loot precious Arcane Relics
                              ($XRLC).
                            </s.TextDescription>
                            <s.SpacerLarge />
                            <s.TextDescription
                              style={{
                                textAlign: 'center',
                                color: 'var(--accent-text)',
                              }}
                            >
                              <small className="text-muted">
                                Stronghold is currently in beta and may have
                                minor bugs.
                              </small>
                            </s.TextDescription>
                            <s.SpacerLarge />
                            <StyledImg
                              alt={'Discover the Stronghold'}
                              src={'/config/images/lordscolab.png'}
                              style={{ imageRendering: 'pixelated' }}
                            />
                            <s.TextDescription
                              style={{
                                textAlign: 'center',
                                color: 'var(--accent-text)',
                                paddingBottom: '30px'
                              }}
                            >
                              Explore the green pastures of our friends:{' '}
                              <a
                                href="https://wolfland.games/land"
                                target="_blank"
                              >
                                Fantom Wolf Game Reborn
                              </a>
                              !
                            </s.TextDescription>
                          </s.Container>
                          <s.SpacerLarge />
                        </s.Container>
                        <Row>
                          <Col>
                            <s.Container
                              ai={'center'}
                              jc={'center'}
                              style={{
                                border: '1px solid var(--secondary)',
                                borderRadius: '10px',
                                padding: '30px',
                                height: '100%',
                                width: 'auto',
                                marginBottom: '30px',
                              }}
                            >
                              <s.TextDescription
                                style={{
                                  textAlign: 'center',
                                  color: 'var(--accent-text)',
                                  fontSize: '1.2rem',
                                }}
                              >
                                You own a total of{' '}
                                {(ownedXRLC / 1e18).toFixed(3)}{' '}
                                <a
                                  href="https://ftmscan.com/token/0xE5586582E1a60E302a53e73E4FaDccAF868b459a"
                                  target="_blank"
                                >
                                  $XRLC
                                </a>
                                .
                              </s.TextDescription>
                            </s.Container>
                          </Col>
                          <Col>
                            <s.Container
                              ai={'center'}
                              jc={'center'}
                              style={{
                                border: '1px solid var(--secondary)',
                                borderRadius: '10px',
                                padding: '30px',
                                height: '100%',
                                width: 'auto',
                                marginBottom: '30px',
                              }}
                            >
                              <s.TextDescription
                                style={{
                                  textAlign: 'center',
                                  color: 'var(--accent-text)',
                                  fontSize: '1.2rem',
                                }}
                              >
                                You can exchange $XRLC on: <br />
                                <a
                                  href="https://spooky.fi/#/swap?outputCurrency=0xe5586582e1a60e302a53e73e4fadccaf868b459a"
                                  target="_blank"
                                >
                                  SpookySwap
                                </a>
                                <br />
                                <a
                                  href="https://beets.fi/#/trade/0xE5586582E1a60E302a53e73E4FaDccAF868b459a"
                                  target="_blank"
                                >
                                  Beethovenx
                                </a>
                              </s.TextDescription>
                            </s.Container>
                          </Col>
                          {/* <Col>
                            <s.Container
                              ai={'center'}
                              jc={'center'}
                              style={{
                                border: '1px solid var(--secondary)',
                                borderRadius: '10px',
                                padding: '30px',
                                height: '100%',
                                width: 'auto',
                                marginBottom: '30px',
                              }}
                            >
                              <s.TextDescription
                                style={{
                                  textAlign: 'center',
                                  color: 'var(--accent-text)',
                                  fontSize: '1.2rem',
                                }}
                              >
                                You can invest in our deflationary pool on
                                Beethovenx:{' '}
                                <a
                                  href="https://beets.fi/#/pool/0x99eb438a19bf25cecece633661f855adabe20a3d000100000000000000000460"
                                  target="_blank"
                                >
                                  A Symphony Of Explosive Relics
                                </a>
                              </s.TextDescription>
                            </s.Container>
                          </Col> */}
                        </Row>
                        <s.SpacerLarge />
                        <Nav
                          key="nav-pills-main-1"
                          variant="pills"
                          defaultActiveKey="#"
                        >
                          <Nav.Item key="nav-pills-item-available">
                            <StyledButton
                              key="nav-pills-btn-available"
                              style={{
                                fontSize: '1.2rem',
                                fontWeight: 'normal',
                                width: 'auto',
                              }}
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                updateDisplaySection('pool');
                              }}
                            >
                              Available Pools
                            </StyledButton>
                          </Nav.Item>

                          {/* {poolsInfo.map((pool, idx) => (
                            <Nav.Item
                              key={`nav-pills-item-${pool.poolId}`}
                              // className={isActive ? 'visible' : 'invisible'}
                            >
                              <StyledButton
                                key={`nav-pills-btn-${pool.poolId}`}
                                style={{
                                  fontSize: '1.2rem',
                                  marginLeft: '15px',
                                  fontWeight: 'normal',
                                  width: 'auto',
                                }}
                                eventKey={`link-${idx}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateDisplaySection(pool.poolId.toString());
                                }}
                              >
                                {pool.poolName.toString() === 'FantomSpecters'
                                  ? 'Fantom Specters'
                                  : pool.poolName}
                              </StyledButton>
                            </Nav.Item>
                          ))} */}
                        </Nav>

                        <s.SpacerLarge />

                        <Row>
                          {poolsInfo.map(
                            (
                              pool,
                              idx // TODO: da cambiare con l'array vero e proprio del poolLength
                            ) => (
                              <Col
                                lg={true}
                                key={`maincol-${pool.poolId}`}
                                style={{
                                  marginBottom: '20px',
                                }}
                              >
                                <Card
                                  key={`card-${pool.poolId}`}
                                  className="text-center zoom"
                                  id={idx.toString()}
                                  style={{
                                    maxWidth: '300px',
                                    height: '100%',
                                    borderRadius: '10px',
                                    backgroundColor: 'var(--primary-dark)',
                                    color: '#fff',
                                    cursor: 'pointer',
                                    display:
                                      isDisplaySection === 'pool'
                                        ? 'block'
                                        : 'none',
                                  }}
                                >
                                  {pool.poolId == 0 && (
                                    <Card.Img
                                      key={`cardimg-${pool.poolId}`}
                                      variant="top"
                                      style={{
                                        height: '18rem',
                                        imageRendering: 'pixelated',
                                      }}
                                      src={`/config/images/lord.gif`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateDisplaySection(
                                          pool.poolId.toString()
                                        );
                                      }}
                                    />
                                  )}
                                  {pool.poolId == 1 && (
                                    <Card.Img
                                      key={`cardimg-${pool.poolId}`}
                                      variant="top"
                                      style={{
                                        height: '18rem',
                                        imageRendering: 'pixelated',
                                      }}
                                      src={`/config/images/specter.gif`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateDisplaySection(
                                          pool.poolId.toString()
                                        );
                                      }}
                                    />
                                  )}
                                  {pool.poolId == 2 && (
                                    <Card.Img
                                      key={`cardimg-${pool.poolId}`}
                                      variant="top"
                                      style={{ height: '18rem' }}
                                      src={`/config/images/creeptoghoul.png`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateDisplaySection(
                                          pool.poolId.toString()
                                        );
                                      }}
                                    />
                                  )}
                                  {pool.poolId == 3 && (
                                    <Card.Img
                                      key={`cardimg-${pool.poolId}`}
                                      variant="top"
                                      style={{
                                        height: '18rem',
                                        imageRendering: 'pixelated',
                                      }}
                                      src={'/config/images/ascendedlord.png'}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateDisplaySection(
                                          pool.poolId.toString()
                                        );
                                      }}
                                    />
                                  )}
                                  {pool.poolId > 3 && (
                                    <Card.Img
                                      key={`cardimg-${pool.poolId}`}
                                      variant="top"
                                      style={{ height: '18rem' }}
                                      src={pool.poolImage}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateDisplaySection(
                                          pool.poolId.toString()
                                        );
                                      }}
                                    />
                                  )}
                                  <Card.Body key={`cardbody-${pool.poolId}`}>
                                    <Card.Title
                                      key={`cardtitle-${pool.poolId}`}
                                      style={{
                                        borderBottom: '1px solid #fff',
                                        paddingBottom: '5px',
                                      }}
                                      className="text-start"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateDisplaySection(
                                          pool.poolId.toString()
                                        );
                                      }}
                                    >
                                      {pool.poolName.toString() ===
                                      'FantomSpecters'
                                        ? 'Fantom Specters'
                                        : pool.poolName}
                                    </Card.Title>
                                    <Row
                                      xs="auto"
                                      key={`row-1-${pool.poolId}`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateDisplaySection(
                                          pool.poolId.toString()
                                        );
                                      }}
                                    >
                                      <Col key={`smcol-1-${pool.poolId}`}>
                                        <Card.Text
                                          key={`cardtext-1-${pool.poolId}`}
                                        >
                                          owned:{' '}
                                          {parseInt(pool.ownedNfts.balance) +
                                            parseInt(pool.stakedNfts.balance)}
                                        </Card.Text>
                                      </Col>
                                      <Col key={`smcol-2-${pool.poolId}`}>
                                        <Card.Text>
                                          staked: {pool.stakedNfts.balance}
                                        </Card.Text>
                                      </Col>
                                    </Row>
                                    <s.SpacerSmall />
                                    <div
                                      style={{
                                        border: '1px solid var(--secondary)',
                                        borderRadius: '10px',
                                        padding: '10px',
                                      }}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        updateDisplaySection(
                                          pool.poolId.toString()
                                        );
                                      }}
                                    >
                                      <Row
                                        xs="auto"
                                        key={`row-2-${pool.poolId}`}
                                      >
                                        <Col key={`smcol-3-${pool.poolId}`}>
                                          <Card.Text
                                            key={`cardtext-2-${pool.poolId}`}
                                          >
                                            {pool.pendingXrlc
                                              ? (
                                                  pool.pendingXrlc / 1e18
                                                ).toFixed(3)
                                              : 0}{' '}
                                            XRLC
                                          </Card.Text>
                                        </Col>
                                        {/* <Col>
                                          <small className="text-muted">
                                            $12.54
                                          </small>
                                        </Col> */}
                                      </Row>
                                      <Row
                                        xs="auto"
                                        key={`row-3-${pool.poolId}`}
                                      >
                                        <Col key={`smcol-4-${pool.poolId}`}>
                                          <Card.Text
                                            key={`cardtext-3-${pool.poolId}`}
                                          >
                                            earned
                                          </Card.Text>
                                        </Col>
                                      </Row>
                                    </div>
                                    <s.SpacerSmall />
                                    {!pool.poolApproval ? (
                                      <StyledButton
                                        key={`aprbtn-1-${pool.poolId}`}
                                        style={{
                                          fontSize: '1.2rem',
                                          fontWeight: 'normal',
                                          width: 'auto',
                                        }}
                                        variant="primary"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          testSetApprovalForAll(pool.poolId);
                                          testPoolInfo();
                                        }}
                                      >
                                        Approve
                                      </StyledButton>
                                    ) : (
                                      <>
                                        {parseInt(pool.ownedNfts.balance) ==
                                          0 &&
                                        parseInt(pool.stakedNfts.balance) >=
                                          1 ? (
                                          <>
                                            <StyledButton
                                              key={`hrvstbtn-1-${pool.poolId}`}
                                              style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 'normal',
                                                width: 'auto',
                                              }}
                                              variant="primary"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                testHarvest(pool.poolId);
                                              }}
                                            >
                                              Harvest
                                            </StyledButton>
                                            <StyledButton
                                              key={`stkbtn-1-${pool.poolId}`}
                                              style={{
                                                fontSize: '1.2rem',
                                                fontWeight: 'normal',
                                                width: 'auto',
                                              }}
                                              variant="primary"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                testWithdrawAll(
                                                  pool.poolId,
                                                  pool
                                                );
                                              }}
                                            >
                                              Unstake All
                                            </StyledButton>
                                          </>
                                        ) : (
                                          <>
                                            {(parseInt(
                                              pool.stakedNfts.balance
                                            ) == 0 &&
                                              parseInt(
                                                pool.ownedNfts.balance
                                              ) >= 1) ||
                                            (parseInt(
                                              pool.stakedNfts.balance
                                            ) >= 1 &&
                                              parseInt(
                                                pool.ownedNfts.balance
                                              ) >= 1) ? (
                                              <>
                                                <StyledButton
                                                  key={`hrvstbtn-1-${pool.poolId}`}
                                                  style={{
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'normal',
                                                    width: 'auto',
                                                  }}
                                                  variant="primary"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    testHarvest(pool.poolId);
                                                  }}
                                                >
                                                  Harvest
                                                </StyledButton>
                                                <StyledButton
                                                  key={`ustbtn-1-${pool.poolId}`}
                                                  style={{
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'normal',
                                                    width: 'auto',
                                                  }}
                                                  variant="primary"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    testDepositAll(
                                                      pool.poolId,
                                                      pool
                                                    );
                                                  }}
                                                >
                                                  Stake All
                                                </StyledButton>
                                              </>
                                            ) : (
                                              <Card.Text
                                                key={`cardtextmin-1-${pool.poolId}`}
                                              >
                                                <small className="text-muted">
                                                  You don't own any{' '}
                                                  {pool.poolName} NFT.
                                                </small>
                                              </Card.Text>
                                            )}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </Card.Body>
                                </Card>
                              </Col>
                            )
                          )}
                        </Row>

                        <s.Container
                          ai={'center'}
                          jc={'center'}
                          style={{
                            // border: '1px solid var(--secondary)',
                            // borderRadius: '10px',
                            padding: '30px',
                            height: '100%',
                            width: '80%',
                            marginBottom: '30px',
                            justifyContent: 'center',
                          }}
                        >
                          <Row
                            xs={1}
                            md={'auto'}
                            lg={'auto'}
                            className="g-4"
                            style={{
                              // border: '1px solid var(--secondary)',
                              // borderRadius: '10px',
                              // padding: '30px',
                              // height: '100%',
                              // width: '1200px',
                              // marginBottom: '30px',
                              justifyContent: 'center',
                            }}
                          >
                            {poolsInfo.map((pool, idx) =>
                              pool.stakedNfts.info.map((id) => (
                                <Col
                                  lg={true}
                                  key={`col-1-${pool.poolId}-${id.tokenId}`}
                                  style={{
                                    marginBottom: '20px',
                                    display:
                                      isDisplaySection ===
                                      pool.poolId.toString()
                                        ? 'block'
                                        : 'none',
                                  }}
                                >
                                  <Card
                                    key={`card-1-${pool.poolId}-${id.tokenId}`}
                                    className="text-center zoom"
                                    id={idx.toString()}
                                    style={{
                                      maxWidth: '300px',
                                      height: '100%',
                                      borderRadius: '10px',
                                      backgroundColor: 'var(--primary-dark)',
                                      color: '#fff',
                                    }}
                                  >
                                    {pool.poolId == 0 &&
                                      (id.tokenId == 1 ||
                                      id.tokenId == 2 ||
                                      id.tokenId == 3 ? (
                                        <Card.Img
                                          key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                          variant="top"
                                          src={`/config/images/lords/${id.tokenId}.gif`}
                                          style={{
                                            imageRendering: 'pixelated',
                                          }}
                                        />
                                      ) : (
                                        <Card.Img
                                          key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                          variant="top"
                                          src={`/config/images/lords/${id.tokenId}.png`}
                                          style={{
                                            imageRendering: 'pixelated',
                                          }}
                                        />
                                      ))}
                                    {pool.poolId == 1 &&
                                      (id.tokenId == 1 ||
                                      id.tokenId == 2 ||
                                      id.tokenId == 4 ||
                                      id.tokenId == 5 ? (
                                        <Card.Img
                                          key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                          variant="top"
                                          src={`https://media-nft.paintswap.finance/250_0xf92d06ff67a955ccfd2cc2515ba6bc125eae4336_${id.tokenId}.webp`}
                                          style={{
                                            imageRendering: 'pixelated',
                                          }}
                                        />
                                      ) : (
                                        <Card.Img
                                          key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                          variant="top"
                                          src={`https://media-nft.paintswap.finance/250_0xf92d06ff67a955ccfd2cc2515ba6bc125eae4336_${id.tokenId}.gif`}
                                          style={{
                                            imageRendering: 'pixelated',
                                          }}
                                        />
                                      ))}
                                    {pool.poolId == 2 && (
                                      <Card.Img
                                        key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                        variant="top"
                                        src={`https://media-nft.paintswap.finance/250_0xd01f0b6f3a5bd70082e4cb058808edf23f1e408a_${id.tokenId}.png`}
                                      />
                                    )}
                                    {pool.poolId > 2 && (
                                      <Card.Img
                                        key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                        variant="top"
                                        src={
                                          parseInt(pool.poolId) == 1 ||
                                          parseInt(pool.poolId) == 2
                                            ? id.image
                                            : // .replace(
                                              //     'https://nftstorage.link/ipfs/',
                                              //     'https://nftstorage.link/ipfs/'
                                              //   )
                                              id.image.replace(
                                                'ipfs://',
                                                'https://nftstorage.link/ipfs/'
                                              )
                                        }
                                      />
                                    )}
                                    <Card.Body
                                      key={`cardbody-1-${pool.poolId}-${id.tokenId}`}
                                    >
                                      <Card.Title
                                        key={`cardtitle-1-${pool.poolId}-${id.tokenId}`}
                                        style={{
                                          borderBottom: '1px solid #fff',
                                          paddingBottom: '5px',
                                        }}
                                        className="text-start"
                                      >
                                        {id.name}
                                      </Card.Title>

                                      <s.SpacerSmall />
                                      <StyledButton
                                        key={`btn-1-${pool.poolId}-${id.tokenId}`}
                                        style={{
                                          fontSize: '1.2rem',
                                          fontWeight: 'normal',
                                          width: 'auto',
                                        }}
                                        variant="primary"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          testWithdraw(pool.poolId, [
                                            parseInt(id.tokenId),
                                          ]);
                                        }}
                                      >
                                        Unstake
                                      </StyledButton>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              ))
                            )}
                            {poolsInfo.map((pool, idx) =>
                              pool.ownedNfts.info.map((id) => (
                                <Col
                                  lg={true}
                                  key={`col-1-${pool.poolId}-${id.tokenId}`}
                                  style={{
                                    marginBottom: '20px',
                                    display:
                                      isDisplaySection ===
                                      pool.poolId.toString()
                                        ? 'block'
                                        : 'none',
                                  }}
                                >
                                  <Card
                                    key={`card-1-${pool.poolId}-${id.tokenId}`}
                                    className="text-center zoom"
                                    id={idx.toString()}
                                    style={{
                                      maxWidth: '300px',
                                      height: '100%',
                                      borderRadius: '10px',
                                      backgroundColor: 'var(--primary-dark)',
                                      color: '#fff',
                                    }}
                                  >
                                    {pool.poolId == 0 &&
                                      (id.tokenId == 1 ||
                                      id.tokenId == 2 ||
                                      id.tokenId == 3 ? (
                                        <Card.Img
                                          key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                          variant="top"
                                          src={`/config/images/lords/${id.tokenId}.gif`}
                                          style={{
                                            imageRendering: 'pixelated',
                                          }}
                                        />
                                      ) : (
                                        <Card.Img
                                          key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                          variant="top"
                                          src={`/config/images/lords/${id.tokenId}.png`}
                                          style={{
                                            imageRendering: 'pixelated',
                                          }}
                                        />
                                      ))}
                                    {pool.poolId == 1 &&
                                      (id.tokenId == 1 ||
                                      id.tokenId == 2 ||
                                      id.tokenId == 4 ||
                                      id.tokenId == 5 ? (
                                        <Card.Img
                                          key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                          variant="top"
                                          src={`https://media-nft.paintswap.finance/250_0xf92d06ff67a955ccfd2cc2515ba6bc125eae4336_${id.tokenId}.jpg`}
                                          style={{
                                            imageRendering: 'pixelated',
                                          }}
                                        />
                                      ) : (
                                        <Card.Img
                                          key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                          variant="top"
                                          src={`https://media-nft.paintswap.finance/250_0xf92d06ff67a955ccfd2cc2515ba6bc125eae4336_${id.tokenId}.gif`}
                                          style={{
                                            imageRendering: 'pixelated',
                                          }}
                                        />
                                      ))}
                                    {pool.poolId == 2 && (
                                      <Card.Img
                                        key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                        variant="top"
                                        src={`https://media-nft.paintswap.finance/250_0xd01f0b6f3a5bd70082e4cb058808edf23f1e408a_${id.tokenId}.png`}
                                      />
                                    )}
                                    {pool.poolId > 2 && (
                                      <Card.Img
                                        key={`cardimg-1-${pool.poolId}-${id.tokenId}`}
                                        variant="top"
                                        src={
                                          parseInt(pool.poolId) == 1 ||
                                          parseInt(pool.poolId) == 2
                                            ? id.image
                                            : // .replace(
                                              //     'https://nftstorage.link/ipfs/',
                                              //     'https://nftstorage.link/ipfs/'
                                              //   )
                                              id.image.replace(
                                                'ipfs://',
                                                'https://nftstorage.link/ipfs/'
                                              )
                                        }
                                      />
                                    )}
                                    <Card.Body
                                      key={`cardbody-1-${pool.poolId}-${id.tokenId}`}
                                    >
                                      <Card.Title
                                        key={`cardtitle-1-${pool.poolId}-${id.tokenId}`}
                                        style={{
                                          borderBottom: '1px solid #fff',
                                          paddingBottom: '5px',
                                        }}
                                        className="text-start"
                                      >
                                        {id.name}
                                      </Card.Title>

                                      <s.SpacerSmall />
                                      <StyledButton
                                        key={`btn-1-${pool.poolId}-${id.tokenId}`}
                                        style={{
                                          fontSize: '1.2rem',
                                          fontWeight: 'normal',
                                          width: 'auto',
                                        }}
                                        variant="primary"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          testDeposit(pool.poolId, [
                                            parseInt(id.tokenId),
                                          ]);
                                        }}
                                      >
                                        Stake
                                      </StyledButton>
                                    </Card.Body>
                                  </Card>
                                </Col>
                              ))
                            )}
                          </Row>
                        </s.Container>
                      </>
                    )}
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
        </ResponsiveWrapper>
        <s.SpacerMedium />
      </s.Container>
    </s.Screen>
  );
}

export default Stronghold;
