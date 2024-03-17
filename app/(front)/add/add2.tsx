'use client'

import React, { useEffect, useState } from 'react';
import ImageKit from 'imagekit';
import Image from 'next/image';
import axios from 'axios'
import { storage } from '../../../lib/firebase-config'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { POST } from '@/lib/auth';
import sharp from 'sharp';



const AddProductForm: React.FC<{ onSubmit: (formData: any) => void }> = ({ onSubmit }) => {

// //     // ImageKit
//   const imagekit = new ImageKit({
//     publicKey: "public_zfnfmyT6QMQG7IzlVPv9IYulFRg=",
//     privateKey: "private_gA4rYPHq2cgIIdjNyHHR2JHohTE=",
//     urlEndpoint: "https://ik.imagekit.io/JMnext08",
//     // authenticationEndpoint: "http://localhost:3000/api/auth",
// });

// // function uploadImage() {
// //   const file = document.getElementById("file1");
// //   console.log('this is file',file)

// //   // Generate authentication parameters
// //   const authenticationParameters = imagekit.getAuthenticationParameters();

// //   // Prepare options for upload
// //   const uploadOptions = {
// //       file: file,
// //       fileName: "abc1.jpg",
// //       folder: "/your_folder", // Specify your desired folder for uploads
// //       useUniqueFileName: true,
// //       tags: ["tag1"],
// //       isPrivateFile: true, // Mark the file as private if needed
// //       customCoordinates: "10,10,100,100", // If you want to crop the image
// //       ...authenticationParameters, // Include authentication parameters
// //   };

// //   // Upload the image
// //   imagekit.upload(uploadOptions, function(err, result) {
// //       if (err) {
// //           console.error('Error uploading image:', err);
// //       } else {
// //           console.log('Image uploaded successfully:', result);
// //       }
// //   });
// // }

const [name, setName] = useState(``)
const [slug, setSlug] = useState(`--`)

const [image, setImage] = useState<File | null>(null)
const [photoref, setPhotoref] = useState(``)

const [banner, setBanner] = useState(`--`)
const [price, setPrice] = useState(`--`)
const [brand, setBrand] = useState(`--`)
const [description, setDescription] = useState(`--`)
const [category, setCategory] = useState(`--`)
const [rating, setRating] = useState(0)
const [numReviews, setnumReviews] = useState(0)
const [countInStock, SetCountInStock] = useState(0)










const folderRef = ref(storage, "images/");


const uploadFile = async(image) => {
  if (image == null) return;
  listAll(folderRef).then((response) => {
    console.log("current response: ", response);
    // response.items.forEach((item, index) => {
      // console.log("loc: ", item._location.path_);

      // const deleteRef = ref(storage, item._location.path_);
      // deleteObject(deleteRef);
    // });
  });
  try {
    if (image) {
      console.log('this is image',image)
      // const convertedImage = await convertToWebP(image);
      // const convertedImageBuffer = await sharp(image.buffer)
      // .webp({ quality: 75 })
      // .toBuffer();


      const imageRef = ref(storage, `images/${image.name + v4()}`);
      uploadBytes(imageRef, image).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          // setCurrentpic(url);
          setPhotoref(url);
          console.log("this url: ",url)



          // handleUpload();
        });
      });


    }

  } catch (err) {
    console.log(err)
  }

};

const handleUpload = async () => {
  // Send a POST request to your backend API endpoint to save the photo reference to MongoDB
  try {
    if (image) {
      const response = await axios.post(`/api/addPPhoto`, {

        name:  image.name,
        slug: image.name.trim().toLowerCase().replace(/\s+/g, '-'),
        image: photoref,  // This is a url on most part
        banner: banner,
        price: price ,
        brand: brand,
        description: description,
        category: category,
        rating: rating,   //dedfault 0
        numReviews: numReviews, //default 0
        countInStock: countInStock,  //default 0

      });
      console.log(response.data);

    }

  } catch (error) {
    console.error(error);
  }
};





  // const [formData, setFormData] = useState({
  //   name: '',
  //   slug: '',
  //   category: '',
  //   image: '',
  //   price: '',
  //   brand: '',
  //   rating: '',
  //   numReviews: '',
  //   countInStock: '',
  // });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { id, value } = e.target;
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     [id]: value,
  //   }));
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   onSubmit(formData);
  //   // You can reset the form fields here if needed
  //   setFormData({
  //     name: '',
  //     slug: '',
  //     category: '',
  //     image: '',
  //     price: '',
  //     brand: '',
  //     rating: '',
  //     numReviews: '',
  //     countInStock: '',
  //   });
  // };

  useEffect(() => {
    console.log(image) ;
    console.log(`this is photoref`,photoref)
  })

  return (
    <div>
     <form  className='flex flex-col bg-blue-400 gap-3 p-4 rounded-lg'>
              <div className='flex justify-center'>
          {photoref && (
            <Image
              className=""
              src={photoref}
              height={80}
              width={80}
              alt=""
            />
          )}
        </div>
      <div className='flex flex-row items-center'>
        <p className='mr-4 text-white'>NAME:</p>
        <input
          className='w-[80%] bg-white rounded-md py-1 px-2 ml-auto'
          id="name"
          type="text"
          placeholder="Name"
          // value={formData.name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      {/* <div className='flex flex-row items-center'>
        <p className='mr-4 text-white'>SLUG:</p>
        <input
          className='w-[80%] bg-white rounded-md py-1 px-2 ml-auto'
          id="slug"
          type="text"
          placeholder="Slug"
          value={formData.slug}
          onChange={handleChange}
        />
      </div> */}
      <div className='flex flex-row items-center '>
        <p className='mr-4 text-white'>IMAGE:</p>
        <input
  className='w-[80%] bg-white rounded-md py-1 px-2 ml-auto'
  type="file"
  placeholder='01'
          onChange={(event) => {
            if (event.target.files && event.target.files.length > 0) {
              const selectedFile = event.target.files[0];
              const fileSizeInBytes = selectedFile.size;
              const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
              console.log(`File size: ${fileSizeInMB.toFixed(2)} MB`);
              // setImage(selectedFile);
              uploadFile(selectedFile)
              setImage(selectedFile);
            } else {
              console.log("No file selected");
              // Handle the case when no file is selected
            }
          }} />
      </div>
      <div className='flex flex-row items-center'>
        <p className='mr-4 text-white'>CATEGORY:</p>
        <input
          className='w-[80%] bg-white rounded-md py-1 px-2 ml-auto'
          id="category"
          type="text"
          placeholder="Category"
          // value={formData.category}
          onChange={(event) => setCategory(event.target.value)}
        />
      </div>

      <div className='flex flex-row items-center'>
        <p className='mr-4 text-white'>PRICE:</p>
        <input
          className='w-[80%] bg-white rounded-md py-1 px-2 ml-auto'
          id="price"
          type="text"
          placeholder="Price"
          // value={formData.price}
          onChange={(event) => setPrice(event.target.value)}
        />
      </div>
      <div className='flex flex-row items-center'>
        <p className='mr-4 text-white'>BRAND:</p>
        <input
          className='w-[80%] bg-white rounded-md py-1 px-2 ml-auto'
          id="brand"
          type="text"
          placeholder="Brand"
          // value={formData.brand}
          onChange={(event) => setBrand(event.target.value)}
        />
      </div>
      {/* <div className='flex flex-row items-center'>
        <p className='mr-4 text-white'>RATING:</p>
        <input
          className='w-[80%] bg-white rounded-md py-1 px-2 ml-auto'
          id="rating"
          type="text"
          placeholder="Rating"
          value={formData.rating}
          onChange={handleChange}
        />
      </div> */}
      {/* <div className='flex flex-row items-center'>
        <p className='mr-4 text-white'>NUMBER OF REVIEWS:</p>
        <input
          className='w-[80%] bg-white rounded-md py-1 px-2 ml-auto'
          id="numReviews"
          type="text"
          placeholder="Number of Reviews"
          value={formData.numReviews}
          onChange={handleChange}
        />
      </div> */}
      <div className='flex flex-row items-center'>
        <p className='mr-4 text-white'>COUNT IN STOCK:</p>
        <input
          className='w-[80%] bg-white rounded-md py-1 px-2 ml-auto'
          id="countInStock"
          type="number"
          placeholder="Count in Stock"
          // value={countInStock}
          onChange={(event) => SetCountInStock(parseInt(event.target.value))}
        />
      </div>
      <button
        // type="submit"
        className='bg-white text-blue-400 py-2 px-4 rounded-md hover:bg-blue-200 transition duration-300 self-center'
        onClick={handleUpload}
      >
        Submit
      </button>

      {/* <button onClick={handleUpload}>
        Upload
      </button> */}


      {/* <button onClick={uploadImage}>Upload Image</button> */}
     </form>
    </div>
  );
};

const MyComponent: React.FC = () => {
  const handleSubmit = (formData: any) => {
    // Handle form submission, e.g., sending data to server
    console.log('Form data:', formData);
  };

  return (
    <div>
      <AddProductForm onSubmit={handleSubmit} />

      {/* <button onClick={uploadImag}>Upload Image</button> */}
    </div>
  );
};

export default MyComponent;
function convertToWebP(image: any) {
  throw new Error('Function not implemented.');
}

