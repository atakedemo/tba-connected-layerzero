// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
pragma abicoder v2;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../lzApp/NonblockingLzApp.sol";

contract XChainTba is NonblockingLzApp {
    //bytes public constant PAYLOAD = "\x01\x02\x03\x04";
    /*
    address|tokenId|nftOwner(0x123...)
     */
    mapping(address => mapping(uint256 => address)) public nftOwner;
    address public LOOTNFT;

    constructor(address _lzEndpoint) NonblockingLzApp(_lzEndpoint) {}
    
    function sendRequestGetTbaInfo(
        uint16 _dstChainId, 
        address _nftAddress, 
        uint256 _tokenId,
        address _nftOwner,
        uint16 _counter
    ) public payable {
        //Create Message
        bytes memory payload = abi.encode(
            _nftAddress,
            _nftOwner,
            _tokenId,
            _counter
        );
        _lzSend(
            _dstChainId, 
            payload, 
            payable(msg.sender), 
            address(0x0), 
            bytes(""), 
            msg.value
        );
    }

    function _nonblockingLzReceive(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        uint64, /*_nonce*/
        bytes memory _payload
    ) internal override {
        //トークン所有者の情報を更新する
        //受け取ったメッセージを複合(NFTアドレス、NFT所有者、トークンID、カウンター)
        address _srcAddressDecoded = abi.decode(_srcAddress, (address));
        require(_srcAddressDecoded!=address(0));
        (
            address _nftAddress, 
            address _nftOwner, 
            uint256 _tokenId,
            uint16 _counter
        ) = abi.decode(_payload, (address, address, uint256, uint16));
        if(_counter==1){
            IERC721 _lootNft = IERC721(_nftAddress);
            if(_lootNft.ownerOf(_tokenId)==_nftOwner){
                sendRequestGetTbaInfo(_srcChainId, _nftAddress, _tokenId,_nftOwner,2);
            }
        } else {
            nftOwner[_nftAddress][_tokenId] = _nftOwner;
        }
        
    }

    /*
    function estimateFee(uint16 _dstChainId, bool _useZro, bytes calldata _adapterParams) public view returns (uint nativeFee, uint zroFee) {
        return lzEndpoint.estimateFees(_dstChainId, address(this), PAYLOAD, _useZro, _adapterParams);
    }
    */
    function setLootNft(address _lootNft) external onlyOwner{
        LOOTNFT = _lootNft;
    }

    function setOracle(uint16 dstChainId, address oracle) external onlyOwner {
        uint TYPE_ORACLE = 6;
        // set the Oracle
        lzEndpoint.setConfig(lzEndpoint.getSendVersion(address(this)), dstChainId, TYPE_ORACLE, abi.encode(oracle));
    }

    function getOracle(uint16 remoteChainId) external view returns (address _oracle) {
        bytes memory bytesOracle = lzEndpoint.getConfig(lzEndpoint.getSendVersion(address(this)), remoteChainId, address(this), 6);
        assembly {
            _oracle := mload(add(bytesOracle, 32))
        }
    }
}