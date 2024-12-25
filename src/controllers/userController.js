const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Kiểm tra đầu vào
  if (!username || !email || !password) {
    return res.status(400).send('Vui lòng cung cấp đầy đủ thông tin');
  }

  try {
    // Kiểm tra email đã tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).send('Email đã được sử dụng');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({ message: "Đăng ký tài khoản thành công"})
  } catch (error) {
    console.error('Lỗi trong quá trình đăng ký:', error);
    return res.status(500).send('Lỗi máy chủ, vui lòng thử lại sau');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra đầu vào
  if (!email || !password) {
    return res.status(400).send('Vui lòng cung cấp email và mật khẩu');
  }

  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send('Email không tồn tại');
    }

    // So sánh mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Mật khẩu không chính xác');
    }
    // Tạo token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET, // Khóa bí mật
      { expiresIn: '1h' } // Token hết hạn sau 1 giờ
  );
    return res.status(200).json({ 
      message: "Đăng nhập thành công",
      token: token,
      user:{
        id: user.id,
        username: user.username,
        email: user.email
      }});
  } catch (error) {
    console.error('Lỗi trong quá trình đăng nhập:', error);
    return res.status(500).send('Lỗi máy chủ, vui lòng thử lại sau');
  }
};

const updateProfile = async (req, res)=>{

  const userId = req.user.id// Lấy từ JWT
  const { username, phone, password, date_of_birth, gender, email, avatar_url } = req.body;
  try{
    // Kiểm tra nếu tất cả các trường đều rỗng hoặc thiếu
    if (!username && !phone && !password && !date_of_birth && !gender && !email && !avatar_url) {
      return res.status(400).send('Không có dữ liệu nào để cập nhật');
    }

    // Tạo đối tượng chứa các trường cần cập nhật
    const hashedPassword = password ? await bcrypt.hash(password,10) : undefined;
    const updateData = {};
    if (username) updateData.username = username;
    if (phone) updateData.phone = phone;
    if (hashedPassword) updateData.password = hashedPassword; // Chỉ thêm password nếu có hash
    if (date_of_birth) updateData.date_of_birth = date_of_birth;
    if (gender) updateData.gender = gender;
    if (email) updateData.email = email;
    if (avatar_url) updateData.avatar_url = avatar_url;

    const updateUser  = await User.update(updateData,{where:{id : userId}})
      if (updateUser[0] === 0) return res.status(404).send('Người dùng không tồn tại');
      return res.status(200).json({message:"cập nhật profile thành công"});
  
  }catch(error){
    console.error(error);
    res.status(500).send('Lỗi máy chủ');
  }
}

const userProfile = async (req, res)=>{
  try{
    const userId = req.user.id
    if(!userId){
      res.status(401).send("Chưa đăng nhập")
    }else{
      const userInfo = await User.findOne({
        where :{id: userId},
        attributes: ["username", "email", "password", "phone", "date_of_birth", "gender"]
      });
      if (!userInfo) {
        return res.status(404).json({ message: "Người dùng không tồn tại" }); // Nếu người dùng không tồn tại
      }
      return res.status(200).json({userInfo})
    }

  }catch(error){
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return res.status(500).json({ message: "Lỗi máy chủ" });
  }
}

const logout = async (req, res) => {
  try {
    // Chỉ gửi phản hồi cho client
    return res.status(200).json({ message: "Đăng xuất thành công" });
} catch (error) {
    console.error('Lỗi khi xử lý đăng xuất:', error);
    return res.status(500).json({ message: "Đăng xuất thất bại, vui lòng thử lại" });
}
};

const getAllAccount = async(req, res)=>{
  try{
  const users= await User.findAll()
    return res.status(200).json(users) 
  }catch(error){
    return res.status(500).json({ message: "Không có người dùng nào" });
  }
}
// update user dành cho admin
const updateUser =async (req, res) => {
  const userId = req.params.id;
  const { email, username, phone, avatar_url, date_of_birth, gender } = req.body;

  try {
    const user = await User.update(
      { email, username, phone, avatar_url, date_of_birth, gender },
      { where: { id: userId } }
    );

    if (user[0] === 0) {
      return res.status(404).send("Người dùng không tồn tại.");
    }

    res.status(200).send("Cập nhật thành công.");
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin người dùng:", error);
    res.status(500).send("Lỗi máy chủ.");
  }
};

module.exports = {
  register,
  login,
  logout,
  updateProfile,
  userProfile,
  getAllAccount,
  updateUser
};
