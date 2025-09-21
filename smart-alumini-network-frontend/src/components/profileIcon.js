import React from 'react';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

const ProfileIcon = (profileForAccount) => {
  return (
    <div>
    {
    ((profileForAccount.profileAccount.profileImage) && (profileForAccount.profileAccount.profileImage.length > 0)) 
    ? 
        (
        <img
            src={
            profileForAccount.profileAccount.profileImage
            }
            alt='Profile'
            height='80'
            width='80'
            className='br-100 '
            style={{ marginLeft: "auto" }}
        />
        ) 
    : 
        (
        <AccountCircleIcon
            style={{
            height: "50px",
            width: "50px",
            marginLeft: "auto",
            color: "black",
            // color: "#D3D3D3",
            }}
        />
        )
    }
    </div>
  )
}

export default ProfileIcon
