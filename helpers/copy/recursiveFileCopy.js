import {readdir, mkdir, stat, copyFile} from 'node:fs/promises';

export const recursiveCopy = async ({originPath: copyPath, copyPath: originPath}) => {

  const copy = async (copyPath, originPath) => {
    // console.log(originPath)
    // console.log(copyPath)
    const stats = await stat(originPath)
    const isFile = stats.isFile()
    if (isFile) {
      await copyFile(originPath, copyPath)
    } else {
      console.log('else')
      // try {
        // await mkdir(originPath, { recursive: true })
        // const list = await readdir(copyPath)
        // list.forEach(async element => {
        //     const fileOriginPath = `${copyPath}/${element}`
        //     const fileCopyPath = `${originPath}/${element}`
        //     const stats = await stat(fileOriginPath)
        //     const isFile = stats.isFile()
        //     const isDirectory = stats.isDirectory()
        //     if (isFile) {
        //         copyFile(fileOriginPath, fileCopyPath)
        //     }
        //     if (isDirectory) {
        //         copy(fileCopyPath, fileOriginPath)
        //     }
        // })
      // } catch {
        // throw new Error('Cannot copy')
      // }
    }
  }
  copy(originPath, copyPath)
};
