const otpGenerator = () => {
    var otp = 0;
    otp = Math.ceil(Math.random()*1000000);
    return otp;
}
export default otpGenerator;