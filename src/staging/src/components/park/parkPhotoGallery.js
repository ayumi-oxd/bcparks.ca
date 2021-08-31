import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Box } from "@material-ui/core"
import { GatsbyImage } from "gatsby-plugin-image"
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox"

const useStyles = makeStyles({
  bigPhoto: {
    objectFit: "cover",
    overflow: "hidden",
    height: 280,
  },
  smallPhoto: {
    objectFit: "cover",
    overflow: "hidden",
    height: 136,
  },
})

export default function ParkPhotoGallery({ photos }) {
  const classes = useStyles()
  const parkPhotos = photos.nodes.map((photo, index) => {
    return {
      index: index,
      caption: photo.caption || "",
      image: photo.image.localFile.childImageSharp.gatsbyImageData,
    }
  })

  if (parkPhotos.length === 0) return null

  const srlOptions = {
    settings: {
      overlayColor: "rgb(0, 0, 0)",
      autoplaySpeed: 1500,
      transitionSpeed: 900,
    },
    thumbnails: {
      showThumbnails: false,
    },
    buttons: {
      showAutoplayButton: false,
      showDownloadButton: false,
      showFullscreenButton: false,
      showThumbnailsButton: false,
      size: "40px",
    },
  }

  return (
    <Grid item xs={12}>
      <Box
        m={2}
        id="park-photo-gallery-container"
        className={classes.photoGallery}
      >
        <SimpleReactLightbox>
          <SRLWrapper options={srlOptions}>
            <Grid item container spacing={1}>
              <Grid item xs={12} md={6}>
                {parkPhotos
                  .filter(f => f.index === 1)
                  .map((photo, index) => (
                    <GatsbyImage
                      className={classes.bigPhoto}
                      image={photo.image}
                      alt={photo.caption}
                      key={index}
                    />
                  ))}
              </Grid>
              <Grid item container xs={12} md={6} spacing={1}>
                {parkPhotos
                  .filter(f => f.index !== 1)
                  .map((photo, index) => (
                    <Grid item xs={6} key={index}>
                      <GatsbyImage
                        className={classes.smallPhoto}
                        image={photo.image}
                        alt={photo.caption}
                        key={index}
                      />
                    </Grid>
                  ))}
              </Grid>
            </Grid>
          </SRLWrapper>
        </SimpleReactLightbox>
      </Box>
    </Grid>
  )
}