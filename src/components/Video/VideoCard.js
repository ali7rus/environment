import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
const VideoCard = (props) => {
  const ref = useRef();
  console.log('ref:',ref);
  const peer = props.peer;
 console.log(" peer:",peer);
  useEffect(() => {

    // peer.on('connect', () => {
    //   console.log('Connection established video');
    // });

    peer.on('stream', (stream) => {
      console.log('Received stream:', stream);

      const videoTracks = stream.getVideoTracks();

      if (videoTracks.length > 0) {
   ref.current.srcObject = stream;
      } else {
        console.log("This stream does not contain video tracks.");
      }

      
    });
    peer.on('track', (track, stream) => {
      console.log('Received track:', track);
    });
  }, [peer]);

  return (
    <Video
      playsInline
      autoPlay
      ref={ref}
    />
  );
};

const Video = styled.video``;

export default VideoCard;
