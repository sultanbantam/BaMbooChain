// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BambooEscrow is Ownable {
    IERC20 public paymentToken;
    address public validator;

    // Beneficiaries
    address public walletBibit;
    address public walletPenanam;
    address public walletPerawatan;
    address public walletRisiko;
    address public walletLahan;
    address public walletRoyalti;
    address public walletPengelola;

    // Basis Points Allocations (10000 = 100%)
    uint256 constant BPS_BIBIT = 1600;     // 16%
    uint256 constant BPS_PENANAM = 400;    // 4%
    uint256 constant BPS_PERAWATAN = 1067; // 10.67%
    uint256 constant BPS_RISIKO = 1333;    // 13.33%
    uint256 constant BPS_LAHAN = 267;      // 2.67%
    uint256 constant BPS_ROYALTI = 667;    // 6.67%
    uint256 constant BPS_PENGELOLA = 4666; // 46.66%

    struct Project {
        uint256 totalAmount;
        bool isBibitReleased;
        bool isTanamReleased;
        bool isRawatReleased;
        bool isRisikoReleased;
        bool isLahanReleased;
        bool isRoyaltiReleased;
        bool isPengelolaReleased;
    }

    mapping(uint256 => Project) public projects;
    uint256 public nextProjectId = 1;

    event Deposit(uint256 indexed projectId, address indexed donatur, uint256 amount);
    event FundsReleased(uint256 indexed projectId, string role, address to, uint256 amount);

    constructor(
        address _paymentToken,
        address _validator,
        address _walletBibit,
        address _walletPenanam,
        address _walletPerawatan,
        address _walletRisiko,
        address _walletLahan,
        address _walletRoyalti,
        address _walletPengelola
    ) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
        validator = _validator;
        walletBibit = _walletBibit;
        walletPenanam = _walletPenanam;
        walletPerawatan = _walletPerawatan;
        walletRisiko = _walletRisiko;
        walletLahan = _walletLahan;
        walletRoyalti = _walletRoyalti;
        walletPengelola = _walletPengelola;
    }

    modifier onlyValidator() {
        require(msg.sender == validator || msg.sender == owner(), "Not authorized validator");
        _;
    }

    function deposit(uint256 amount) external returns (uint256) {
        require(amount > 0, "Amount must be > 0");
        uint256 projectId = nextProjectId++;
        
        projects[projectId].totalAmount = amount;
        
        // Transfer token from user to this contract
        require(paymentToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        emit Deposit(projectId, msg.sender, amount);
        return projectId;
    }

    function releaseBibit(uint256 projectId) external onlyValidator {
        Project storage p = projects[projectId];
        require(p.totalAmount > 0, "Project not found");
        require(!p.isBibitReleased, "Already released");

        p.isBibitReleased = true;
        uint256 amountToRelease = (p.totalAmount * BPS_BIBIT) / 10000;
        
        require(paymentToken.transfer(walletBibit, amountToRelease), "Transfer failed");
        emit FundsReleased(projectId, "Bibit", walletBibit, amountToRelease);
    }

    function releaseTanam(uint256 projectId) external onlyValidator {
        Project storage p = projects[projectId];
        require(p.totalAmount > 0, "Project not found");
        require(!p.isTanamReleased, "Already released");

        p.isTanamReleased = true;
        uint256 amountToRelease = (p.totalAmount * BPS_PENANAM) / 10000;
        
        require(paymentToken.transfer(walletPenanam, amountToRelease), "Transfer failed");
        emit FundsReleased(projectId, "Penanam", walletPenanam, amountToRelease);
    }

    function releasePerawatan(uint256 projectId) external onlyValidator {
        Project storage p = projects[projectId];
        require(p.totalAmount > 0, "Project not found");
        require(!p.isRawatReleased, "Already released");

        p.isRawatReleased = true;
        uint256 amountToRelease = (p.totalAmount * BPS_PERAWATAN) / 10000;
        
        require(paymentToken.transfer(walletPerawatan, amountToRelease), "Transfer failed");
        emit FundsReleased(projectId, "Perawatan", walletPerawatan, amountToRelease);
    }

    function releaseRisiko(uint256 projectId) external onlyValidator {
        Project storage p = projects[projectId];
        require(p.totalAmount > 0, "Project not found");
        require(!p.isRisikoReleased, "Already released");

        p.isRisikoReleased = true;
        uint256 amountToRelease = (p.totalAmount * BPS_RISIKO) / 10000;
        
        require(paymentToken.transfer(walletRisiko, amountToRelease), "Transfer failed");
        emit FundsReleased(projectId, "Risiko", walletRisiko, amountToRelease);
    }

    function releaseLahan(uint256 projectId) external onlyValidator {
        Project storage p = projects[projectId];
        require(p.totalAmount > 0, "Project not found");
        require(!p.isLahanReleased, "Already released");

        p.isLahanReleased = true;
        uint256 amountToRelease = (p.totalAmount * BPS_LAHAN) / 10000;
        
        require(paymentToken.transfer(walletLahan, amountToRelease), "Transfer failed");
        emit FundsReleased(projectId, "Lahan", walletLahan, amountToRelease);
    }

    function releaseRoyalti(uint256 projectId) external onlyValidator {
        Project storage p = projects[projectId];
        require(p.totalAmount > 0, "Project not found");
        require(!p.isRoyaltiReleased, "Already released");

        p.isRoyaltiReleased = true;
        uint256 amountToRelease = (p.totalAmount * BPS_ROYALTI) / 10000;
        
        require(paymentToken.transfer(walletRoyalti, amountToRelease), "Transfer failed");
        emit FundsReleased(projectId, "Royalti", walletRoyalti, amountToRelease);
    }

    function releasePengelola(uint256 projectId) external onlyValidator {
        Project storage p = projects[projectId];
        require(p.totalAmount > 0, "Project not found");
        require(!p.isPengelolaReleased, "Already released");

        p.isPengelolaReleased = true;
        uint256 amountToRelease = (p.totalAmount * BPS_PENGELOLA) / 10000;
        
        require(paymentToken.transfer(walletPengelola, amountToRelease), "Transfer failed");
        emit FundsReleased(projectId, "Pengelola", walletPengelola, amountToRelease);
    }
}
