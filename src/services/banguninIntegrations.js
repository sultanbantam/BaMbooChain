// packages/integrations stub implementation for BangunIn v2.0
// BTN Core Banking, E-Toll BTN, Kopdes Merah Putih, BI Checking, IoT Hub, Blockchain, Bank Sampah, Payment

export const btnCoreService = {
  async submitKPR(application) {
    return {
      success: true,
      sp3kNumber: `SP3K-BTN-${Date.now().toString().slice(-6)}`,
      status: 'APPROVED',
      approvedAmount: application.amount || 168000000,
      monthlyInstallment: application.monthlyInstallment || 1080000,
      timestamp: new Date().toISOString(),
      bankOfficer: 'Ir. Hendra Wijaya (Bank BTN KC Serang)'
    };
  },

  async verifyProgress(milestoneId, geotag) {
    return {
      success: true,
      milestoneId,
      verified: true,
      inspector: 'Ir. Hendra Wijaya (Bank BTN Officer)',
      geotagVerified: Boolean(geotag),
      verifiedAt: new Date().toISOString()
    };
  },

  async disburse(applicationId, terminStage, amount) {
    return {
      success: true,
      transactionId: `TX-DISB-BTN-${Date.now().toString().slice(-8)}`,
      applicationId,
      terminStage,
      amount,
      disbursedAt: new Date().toISOString(),
      status: 'DISBURSED'
    };
  }
};

export const btnEtollService = {
  cardNumber: '6013-0988-1244-8891',
  currentBalance: 145000,
  btnCommissionRate: 150, // Rp 150 per transaction (BTN Daily Revenue)

  async processPayment(bookingId, amount, serviceName) {
    const fee = this.btnCommissionRate;
    const netDeduction = amount;
    this.currentBalance = Math.max(0, this.currentBalance - netDeduction);
    
    return {
      success: true,
      txId: `ETOLL-BTN-${Date.now().toString().slice(-7)}`,
      bookingId,
      serviceName,
      amountDeducted: netDeduction,
      remainingBalance: this.currentBalance,
      btnCommission: fee,
      settledAt: new Date().toISOString(),
      status: 'SUCCESS'
    };
  },

  async topUp(amount) {
    this.currentBalance += amount;
    return {
      success: true,
      newBalance: this.currentBalance,
      reference: `TOPUP-BTN-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString()
    };
  },

  calculateCommission(totalTransactions) {
    return totalTransactions * this.btnCommissionRate;
  }
};

export const kopdesMerahPutihService = {
  partnerName: 'Koperasi Desa Merah Putih Taktakan Mandiri',
  partnerVillage: 'Desa Taktakan, Kec. Taktakan, Serang, Banten',

  async listProducts() {
    return [
      { id: 'kp-1', name: 'Beras SPHP Bulog (5 Kg)', price: 62500, stock: 120, category: 'Pangan Pokok', unit: 'Sak 5kg' },
      { id: 'kp-2', name: 'Minyakita Kemasan Pouch (1 Liter)', price: 15500, stock: 85, category: 'Pangan Pokok', unit: 'Pouch 1L' },
      { id: 'kp-3', name: 'Telur Ayam Ras Segar (1 Kg)', price: 28000, stock: 45, category: 'Lauk Pauk', unit: 'Kg' },
      { id: 'kp-4', name: 'Gula Pasir Maniskita (1 Kg)', price: 17500, stock: 60, category: 'Pangan Pokok', unit: 'Kg' },
      { id: 'kp-5', name: 'Paket Sayuran Segar Petik Kebun MBR', price: 15000, stock: 30, category: 'Sayuran Organik', unit: 'Paket' },
      { id: 'kp-6', name: 'Bumbu Dapur Dasar Halus Komplit', price: 12000, stock: 50, category: 'Bumbu Masak', unit: 'Toples 250g' }
    ];
  },

  async createOrder(items, totalAmount, deliveryType, notes) {
    return {
      success: true,
      orderId: `KOPDES-ORD-${Date.now().toString().slice(-6)}`,
      items,
      totalAmount,
      deliveryType, // 'SHUTTLE_DELIVERY' | 'SELF_PICKUP'
      status: 'CONFIRMED',
      shuttleAssigned: deliveryType === 'SHUTTLE_DELIVERY' ? 'Mobil Angkutan Logistik Warga (A 9988 KD)' : null,
      notes,
      createdAt: new Date().toISOString()
    };
  }
};

export const biCheckingService = {
  async checkNIK(nik) {
    // Simulated realistic SLIK OJK / BI Checking evaluation
    const isClean = !nik || !nik.endsWith('9');
    return {
      nik,
      checkDate: new Date().toISOString(),
      score: isClean ? 98 : 45,
      collectibilityCode: isClean ? 'KOL-1' : 'KOL-3',
      collectibilityStatus: isClean ? 'LANCAR' : 'DALAM PERHATIAN KHUSUS',
      flppEligible: isClean,
      notes: isClean 
        ? 'Riwayat perbankan bersih tanpa tunggakan. Memenuhi kriteria verifikasi KPR FLPP Bank BTN.' 
        : 'Terdapat catatan tunggakan kredit konsumtif di bank lain. Membutuhkan klarifikasi.',
      referenceNumber: `SLIK-OJK-${Date.now().toString().slice(-8)}`
    };
  }
};

export const iotHubService = {
  async getReadings(unitId) {
    return {
      unitId,
      timestamp: new Date().toISOString(),
      sensors: {
        energyConsumptionKwh: 4.2,
        waterConsumptionLiters: 185,
        indoorTemperatureCelsius: 25.4, // cooler due to engineered bamboo
        airQualityAQI: 24, // Clean & healthy
        wasteCapacityPercent: 42
      }
    };
  }
};

export const blockchainService = {
  network: 'Polygon PoS (Amoy Testnet) / BaMbooChain On-Chain',
  contractAddress: '0x8f7311B903E4804369062E56B69046f59Ab00192',

  async recordMilestoneProgress(milestoneId, unitId, inspector) {
    const fakeTxHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');
    return {
      success: true,
      txHash: fakeTxHash,
      milestoneId,
      unitId,
      blockNumber: 49812034,
      inspector,
      timestamp: new Date().toISOString()
    };
  }
};
