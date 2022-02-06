const stripmsg = (originalMsg) => {
  try {
    originalMsg
      .split("<!-- message -->")[1]
      .split("message -->")[0]
      .split("\x3C!-- google_ad_section_start -->")[1]
      .split("google_ad_section_start -->")[0]
      .split("\x3C!")[0]
      .replace(/(<([^>]+)>)/gi, "")
      .replace(/\n/g, "")
      .replace(/\t/g, "")
      .replace(/&#13;/g, "");
  } catch (e) {
    return originalMsg;
  }
};

// Para Discussions
// Ler topicos.jsonlines
// Se não já tiver criado essa discussion
// Procurar no movies_imdb

// Para Comments
// Ler comentarios
// Se não já tiver criado esse comment (c.match(/td_post_([^""]+)/)[1])
