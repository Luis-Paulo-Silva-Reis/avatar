import React from 'react';
import './style.css';
import Avatar from '../Avatar';
export default function App() {
  return (
    <div>
      <h1>Hello StackBlitz!</h1>
      <p>Start editing to see some magic happen :)</p>
      <Avatar
        accessKeyId="dfgdfg"
        secretAccessKey="BldEzbfUqO2qp/"
        bucketName="bucket-sb9j8b"
        region="us-east-1"
      />
    </div>
  );
}
