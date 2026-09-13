// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title  The Nest
 * @notice Lady AMARA / $AMARA fee sink on Robinhood Chain 4663.
 *         Play as Amara. Unite Ivy, Splashy, and Moony before darkness.
 *         Every swap feeds this vault. Play is free.
 *
 *         LetsCash creator stream lands here after ops updateCreator(poolId, nest).
 *         harvest() is permissionless and calls hook.claim — ETH stays in this contract.
 *         pull() is ops only. One-shot setters. Wrong pool id locks the slot.
 *
 *         Do not set this address as the LetsCash fee recipient on the launch form.
 *         Fee recipient = ops EOA, then hook.updateCreator(poolId, this).
 *
 *         ladyamara.xyz · @AmaraCatXYZ · github.com/LadyAmaraXYZ/ladyamara
 */

interface ILetscashHook {
    function claim(bytes32 poolId) external;
}

contract Nest {
    address public ops;
    address public token;
    address public claimer;
    bytes32 public poolId;

    bool public tokenSet;
    bool public poolSet;
    bool public claimerSet;

    string public constant NAME = "Lady AMARA";
    string public constant TICKER = "AMARA";
    string public constant SLOGAN = "Bring them home before the moon sets.";
    string public constant LINE = "Mom. Three kittens. One moon.";
    string public constant DESCRIPTION =
        "Play as Amara. Unite Ivy, Splashy, and Moony before darkness. Every swap feeds the Nest.";
    string public constant WEBSITE = "https://ladyamara.xyz";
    string public constant X = "https://x.com/AmaraCatXYZ";
    string public constant X_HANDLE = "@AmaraCatXYZ";
    string public constant GITHUB = "https://github.com/LadyAmaraXYZ/ladyamara";
    string public constant IMAGE = "https://ladyamara.xyz/letscash.jpg";

    event Harvested(uint256 amount);
    event Pulled(address indexed to, uint256 amount);
    event TokenSet(address token);
    event PoolSet(bytes32 poolId);
    event ClaimerSet(address claimer);

    modifier onlyOps() {
        require(msg.sender == ops, "only ops");
        _;
    }

    constructor(address ops_) {
        require(ops_ != address(0), "ops");
        ops = ops_;
    }

    receive() external payable {}

    function harvest() external {
        require(claimer != address(0) && poolId != bytes32(0), "unset");
        uint256 before = address(this).balance;
        ILetscashHook(claimer).claim(poolId);
        emit Harvested(address(this).balance - before);
    }

    function pull(address to, uint256 amount) external onlyOps {
        require(to != address(0), "to");
        require(amount > 0 && amount <= address(this).balance, "amount");
        (bool ok, ) = payable(to).call{value: amount}("");
        require(ok, "eth");
        emit Pulled(to, amount);
    }

    function setTokenCA(address a) external onlyOps {
        require(!tokenSet, "set");
        require(a != address(0), "zero");
        token = a;
        tokenSet = true;
        emit TokenSet(a);
    }

    function setPoolId(bytes32 id) external onlyOps {
        require(!poolSet, "set");
        require(id != bytes32(0), "zero");
        poolId = id;
        poolSet = true;
        emit PoolSet(id);
    }

    function setClaimer(address a) external onlyOps {
        require(!claimerSet, "set");
        require(a != address(0), "zero");
        claimer = a;
        claimerSet = true;
        emit ClaimerSet(a);
    }

    function socials()
        external
        pure
        returns (
            string memory name_,
            string memory ticker_,
            string memory slogan_,
            string memory description_,
            string memory website_,
            string memory x_,
            string memory handle_,
            string memory github_,
            string memory image_
        )
    {
        return (NAME, TICKER, SLOGAN, DESCRIPTION, WEBSITE, X, X_HANDLE, GITHUB, IMAGE);
    }
}
