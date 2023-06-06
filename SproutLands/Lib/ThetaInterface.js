export default class ThetaInterface {
	constructor() {
		this.web3 = new Web3("https://eth-rpc-api.thetatoken.org/rpc");
		const chainID = 361;
		this.tfuelAmount = 0;
		this.tdropAmount = 0;
	}

	async loadTDropContract() {
		const tdropAddress = "0x1336739B05C7Ab8a526D40DCC0d04a826b5f8B03";
		let response = await fetch("./Lib/ABI/TDropABI.json");
		let abi = await response.json();
		this.tdropContract = new this.web3.eth.Contract(abi, tdropAddress);
	}

	async getCurrentTreasure(complete) {
		const treasureAddress = "0x7b5ce75d99eab5a88946183dba9acb2481718fac";
		if (!this.tdropContract) {
			await this.loadTDropContract();
		}
		this.tdropContract.methods
			.balanceOf(treasureAddress)
			.call((err, result) => {
				const amount = this.web3.utils.fromWei(result, "ether");
				this.tdropAmount = amount;
				this.web3.eth.getBalance(
					treasureAddress,
					function (err, wei) {
						const TFuel = this.web3.utils.fromWei(wei, "ether");
						this.tfuelAmount = TFuel;
						complete(this.tfuelAmount, this.tdropAmount);
					}.bind(this)
				);
			});
	}
}
