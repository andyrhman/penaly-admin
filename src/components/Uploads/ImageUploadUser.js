import axios from 'axios';
import React from 'react'

const ImageUploadUser = (props) => {

    const upload = async (files) => {
        try {
            if (files === null) return;

            const formData = new FormData();
            formData.append('image', files[0]);

            const { data } = await axios.post('upload/users', formData);

            props.uploaded(data.url);
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <input
                className="sr-only"
                type="file"
                name="profile"
                id="profile"
                onChange={(e) => upload(e.target.files)}
            />
        </>
    )
}

export default ImageUploadUser;