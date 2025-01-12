const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const RecordedSong = require('../model/RecordedSongs');
const Comments = require('../model/Comments');
const sequelize = require('../config/database');

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
        email: user.email,
        avatar_url: user.avatar_url
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
        attributes: ["username", "email", "password", "phone", "date_of_birth", "gender", "avatar_url"]
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


const createRecordedSong = async(req, res) => {

  try{
  const user_id = req.user.id;
  const{song_name, recording_path, title, status} = req.body;

  if (!song_name || !recording_path || !title) {
    return res.status(400).json({
      message: 'Thiếu thông tin cần thiết (song_name, recording_path, !title)!',
    });
  }
  const recordedSong = await RecordedSong.create({
    user_id,
    song_name,
    recording_path,
    title,
    status: status || 'public', // Mặc định là public nếu không được gửi
  });

  return res.status(201).json(recordedSong);
  }catch(error){
    return res.status(500).json({
      message: 'Lỗi khi đăng bài ghi âm!',
      error: error.message,
    });
  }

}

const getRecordedSongList = async(req, res) => {
  try{
    const record = await RecordedSong.findAll({
      attributes: [
        "id",
        "user_id",
        "song_name",
        "title",
        "recording_path",
        "upload_time",
        "likes_count",
        "status",
        // Đếm số lượng bình luận cho bài hát cụ thể
        [sequelize.literal(`(SELECT COUNT(*) FROM Comments WHERE Comments.song_id = RecordedSong.id)`), "comments_count"]
    ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['user_id', 'username', 'avatar_url'] // Lấy thông tin user
        }
      ],
    })
    if (!record || record.length === 0) {
      return res.status(404).json({ message: "Không có bản ghi nào" });
  }
    return res.status(200).json(record) 
  }catch(error){
    console.error("Lỗi lấy danh sách bài hát:", error);
    return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }

}

const CreateComment = async (req, res) =>{
  try{
      const user_id = req.user.id;
      const {song_id, comment_text} = req.body;

      if(!comment_text || !song_id){
        return res.status(400).json({
          message: 'Chưa bình luận',
        });
      }

      const comment = await Comments.create({
        user_id,
        song_id,
        comment_text
      });
      return res.status(201).json(comment);
  }catch(error){
    return res.status(500).json({
      message: 'Lỗi khi comment',
      error: error.message,
    });
  }
}
const getCommentList = async (req, res) =>{
  try{
      const song_id = req.params.song_id;
      const comment = await Comments.findAll({
        where: {song_id: song_id},
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['user_id', 'username', 'avatar_url'] // Lấy thông tin user
          }
        ],
        order: [['comment_time', 'DESC']] // Sắp xếp theo thời gian mới nhất
  });
      return res.status(200).json(comment) 
  }catch(error){
    return res.status(500).json({
      message: 'Lỗi lấy comment',
      error: error.message,
    });
  }
}


module.exports = {
  register,
  login,
  logout,
  updateProfile,
  userProfile,
  getAllAccount,
  updateUser,
  createRecordedSong,
  getRecordedSongList,
  CreateComment,
  getCommentList,
};
