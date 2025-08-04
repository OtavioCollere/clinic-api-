export class EditorUserFoundError extends Error {
  constructor(){
    super("Editor user not found");
  }
}