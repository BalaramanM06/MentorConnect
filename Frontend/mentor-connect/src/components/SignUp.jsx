import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "",
    role: "",
    profilePhoto: null,
    profilePhotoName: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profilePhoto: file, profilePhotoName: file.name});
    if(file) {
      const photoSpan = document.querySelector(".photo-upload-span") ;
      photoSpan.textContent = "Photo uploading...";
      photoSpan.style.color = "green";
      setTimeout(() => {
        photoSpan.textContent = "Uploaded Successfully" ;
        photoSpan.style.color = "blue";
      }, 3000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      const invalidSpan = document.querySelector(".invalid-span") ;
      invalidSpan.textContent = "Passwords do not match!";
      return;
    }

    if (!formData.role) {
      const invalidSpan = document.querySelector(".invalid-span") ;
      invalidSpan.textContent = "Please select a role (Mentor or Student).";
      return;
    }

    if(!formData.profilePhoto) {
      const invalidSpan = document.querySelector(".invalid-span") ;
      invalidSpan.textContent = "Please upload a profile photo";
      return;
    }

    navigate("/signup-step2", { state: { name: formData.fullName, role: formData.role } });
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>SignUp</h2>
        <p style={{color: 'grey', fontSize: '12px' , fontFamily: 'sans-serif'}}>A mentor is someone who allows you to see the hope inside yourself</p>
        <p style ={{color: 'red', fontSize:'17px' , fontWeight: 'bold'}} className="invalid-span"></p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

          <select name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="">Are you a Mentor or Student?</option>
            <option value="mentor">Mentor</option>
            <option value="student">Student</option>
          </select>

          <div className="file-upload">
            <label htmlFor="file-input">Upload Profile Photo</label>
            <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} />
            {formData.profilePhotoName && (<p className="file-name">Selected File: {formData.profilePhotoName}</p>)}
          </div>
          <p style ={{fontSize:'12px'}} className="photo-upload-span"></p>

          <button type="submit">Next</button>
          <p>Already have an account? <span className="login-link" onClick={() => navigate('/login')}>Login</span></p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
