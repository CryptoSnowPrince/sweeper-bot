const dotenv = require("dotenv");
dotenv.config();

module.exports = {
    sweep_accounts: [
        {
            address: "0x1dbe97e20f3Fbf9db1b8a5a2aD512f382Ba30C5B",
            private: process.env.PK,
        }
    ],
    receive_address: "0x76c3c691723131A77B70D2dB40d8E05caACa2c66",
    gasMultipluer: "4",
    rpc: {
        https: "http://127.0.0.1:8545",
        wss: "ws://127.0.0.1:8546"
    }
}