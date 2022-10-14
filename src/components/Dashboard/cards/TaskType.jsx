import React, { useState, useEffect } from 'react'
import { Text, H5 } from "@adminjs/design-system"
import { Chart } from 'react-google-charts'
import { ApiClient, useTranslation } from 'adminjs'
import _ from 'lodash'

import { Card } from '../styles'

// const data = [
//     ["Tarefa", 'Horas por dia'],
//     ["Trabalho", 8],
//     ["Comer", 2],
//     ["Conversar", 2],
//     ["Dormir", 8]
// ]

const api = new ApiClient()

const makeChartData = (records) =>{
    if (records.length == 0) return;

    const status = {
        backlog: 'Backlog',
        doing: 'Em Execução',
        done: 'Pronto',
        approved: 'Aprovado',
        rejected: 'Rejeitado',
    }

    const values = _.groupBy(records, (record) => record.params.status)
    const data = _.map(status, (value, key) => [value, values[key]?.length || 0])

    // console.log("values", values)
    // console.log("data", data)

    return[
        ["Tipo de tarefa", "Quantidade"],
        ...data,
    ]
}

const TaskType = () =>{
    const {translateMessage} = useTranslation()

    const [chartData, setChartData] = useState('[]')
    const [loading, setLoading] = useState(true)
    const [isEmpty, setIsEmpty] = useState(true)

    useEffect(() => {
        (async () => {
            const response = await api.resourceAction({
                    resourceId:'tasks',
                    actionName:'list',
                })

                setChartData(makeChartData(response.data.records))
                setIsEmpty(response.data.records.length == 0)
                setLoading(false)
        })()
    }, [])

    if (loading){
        return <></>
    }

    return (
    <Card as="a" href="/admin/resources/tasks">
        <Text textAlign='center'>
            <H5 mt='lg'>{translateMessage("taskTypeCardTitle")}</H5>
            { isEmpty ? (
                    <Text>Sem Tarefas</Text>
                ) : (
                <Chart 
                    chartType='PieChart'
                    data={chartData}
                    width={"100%"}
                    height={"100%"}
                />
                )}
        </Text>
    </Card>
    )
}

export default TaskType