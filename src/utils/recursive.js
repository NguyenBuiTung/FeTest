// export const transformData = (data) => {
//   if (!data || !Array.isArray(data)) {
//     return [];
//   }
//   return data?.map((item) => {
//     const transformedItem = {
//       label: item.name,
//       value: item.id,
//     };
//     if (item?.districts && Array.isArray(item?.districts)) {
//       transformedItem.children = item?.districts.map((district) => ({
//         label: district?.name,
//         value: district?.id,
//         children:
//           district?.wards && Array.isArray(district?.wards)
//             ? district?.wards.map((ward) => ({
//                 label: ward?.name,
//                 value: ward?.id,
//               }))
//             : [],
//       }));
//     }
//     return transformedItem;
//   });
// };


export const transformData = (data) => {
  return data?.map((item) => {
    const transformedItem = {
      value: item.id,
      title: item.name,
      parent_id: item.parent_id,
      children: item.children,
    };
    if (item.children) {
      transformedItem.children = transformData(item.children);
    }
    return transformedItem;
  });
};