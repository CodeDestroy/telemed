import React, {useEffect, useState} from 'react'
import Calendar from '../../Calendar'
import IntegrationService from '../../../Services/IntegrationService';
const groupByEmpId = (data) => {
  return data.reduce((acc, current) => {
    (acc[current.empid] = acc[current.empid] || []).push(current);
    return acc;
  }, {});
};

// Функция для сортировки по дате и времени
const sortByDateTime = (data) => {
  return data.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    if (a.stime < b.stime) return -1;
    if (a.stime > b.stime) return 1;
    return 0;
  });
};
function Index() {
  const [groupedData, setGroupedData] = useState({});
  
  const [loading, setLoading] = useState(false)

  
  // Группируем данные по empid
  useEffect(() => {
    // Группируем данные по empid
    async function fetch () {
      try {
        setLoading(true)
        const response = await IntegrationService.getOnlineSched()
        setLoading(false)
        const grouped = groupByEmpId(response.data);
        console.log(Object.entries(grouped))
        setGroupedData(grouped);
      }
      catch (e) {
        console.log(e)
      }
    }

    fetch()
    
    

    // Сортируем каждую группу по дате и времени
    /* for (const empid in grouped) {
      grouped[empid] = sortByDateTime(grouped[empid]);
    } */
    /* console.log(grouped) */
  }, []);

 /*  useEffect(()=> {console.log(groupedData)},[groupedData]) */


  return (
    <>
      {
        Object.entries(groupedData).length > 0 ? (
          <>
            {
              Object.entries(groupedData).map(data => {
                return (
                  <div key={data[0]}>
                    <Calendar data={data[1]} emp={data[0]}/>
                  </div>
                )
              })
            }
          </>
        )
        :
        (loading ? <div>Загрузка</div> : <div>Нет данных</div>)
        
        
      }
    </>
    
    
  )
}

export default Index