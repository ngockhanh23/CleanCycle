class ConvertServices {
    static objectToString(obj: Object) {
        try {
          return JSON.stringify(obj);
        } catch (error) {
          console.error("Error converting object to string:", error);
          return null;
        }
      }
    
      // Hàm chuyển đổi từ String sang Object
      static stringToObject(str:string) {
        try {
          return JSON.parse(str);
        } catch (error) {
          console.error("Error converting string to object:", error);
          return null;
        }
      }
}
export default ConvertServices;