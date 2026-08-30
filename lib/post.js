import path from "path";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";


//process.cwd()は現在の作業ディレクトリを返します
const postsDirectory = path.join(process.cwd(), "posts");

//mdファイルのデータを取り出す
export function getPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, ""); //拡張子を除く

    //マークダウンファイルを文字列として読み込む
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    return {
      id,
      ...matterResult.data,
    };
  });
  return allPostsData;
}

//getStaticPathでreturnで使うpathを取得する
export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
  /*
  [
    {
      params: {
        id: 'ssg-ssr'
      }
    },
    {
      params: {
        id: 'prerendering'
      }
    }
  ]
  */
}

//idに基づいてプログ投稿データを返す
export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContent = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContent);
  
  const blogContent = await remark().use(html).process(matterResult.content);

  const blogContentHtml = blogContent.toString();

  return {
    id,
    blogContentHtml,
    ...matterResult.data,
  };
}