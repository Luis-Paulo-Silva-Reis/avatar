import React, { useState } from 'react';
import AWS from 'aws-sdk';

function Avatar(props) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  function handleChange(event) {
    const file = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      setError('Apenas imagens são permitidas');
      setImage(null);
      return;
    }

    setError(null);
    setImage(URL.createObjectURL(file));
  }

  async function handleUpload() {
    setUploading(true);
    setError(null);
    setProgress(0);

    const file = image;
    const bucketName = props.bucketName;
    const region = props.region;

    const s3 = new AWS.S3({
      region: region,
      accessKeyId: props.accessKeyId,
      secretAccessKey: props.secretAccessKey,
    });

    const uniqueId = Date.now().toString();
    const fileName = `${uniqueId}-${file.name}`;

    const params = {
      Bucket: bucketName,
      Key: fileName, // use a variável fileName, que inclui um ID único, em vez de file.name
      ContentType: file.type,
      Body: file,
    };

    const request = s3.upload(params, function (err, data) {
      if (err) {
        setError(err.message);
        setUploading(false);
        return;
      }

      setUploading(false);
      setProgress(100);

      if (props.onUpload) {
        props.onUpload(data.Location);
      }
    });

    request.on('httpUploadProgress', function (progress) {
      const loaded = progress.loaded;
      const total = progress.total;
      const percent = Math.round((loaded / total) * 100);

      setProgress(percent);
    });

    request.send();
  }

  function handleCancel() {
    setError(null);
    setImage(null);
    setUploading(false);
    setProgress(0);
  }

  return (
    <div className="avatar">
      <div className="image">
        {image && <img src={image} alt="Avatar" />}
        {uploading && (
          <div className="progress">
            <progress value={progress} max="100" />
            <span>{progress}%</span>
            <button onClick={handleCancel}>Cancelar</button>
          </div>
        )}
        {error && <div className="error">{error}</div>}
      </div>
      <div className="actions">
        <input type="file" accept="image/*" onChange={handleChange} />
        <button onClick={handleUpload} disabled={!image || uploading}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Avatar;
