import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, FlatList, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import api from './services/api';


export default function App() {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        api.get('/projects').then(response => {
            setProjects(response.data);
        })

    }, []);

    async function handleRemoveProject(id) {

        const removeIndex = projects.findIndex(project => project.id === id);
        console.log(removeIndex)
        if (removeIndex >= 0) {
            const updatedList = [...projects];
            updatedList.splice(removeIndex, 1);
            setProjects(updatedList);
            await api.delete(`projects/${id}`);
        }

    }

    function handleAddProject(time) {

        api.post('/projects', {
            title: `Created at ${time}`,
            owner: 'Alan Siqueira',
        }).then(response => {
            const project = response.data;
            setProjects([...projects, project])
        })
        
    }


    return (
        <>
            <StatusBar backgroundColor="#7159c1" />
            <SafeAreaView style={styles.container}>
                <FlatList
                    data={projects}
                    keyExtractor={project => project.id}
                    renderItem={({ item: project }) => (
                        <View style={styles.listItem}>
                            <View>
                                <Text style={styles.title} >{project.title}</Text>
                                <Text style={styles.subtitle} >{project.owner}</Text>
                            </View>
                            <View>
                                <TouchableOpacity onPress={()=> {handleRemoveProject(project.id)}} style={styles.removeButton}>
                                    <Text style={styles.removeButtonText}>X</Text>
                                </TouchableOpacity>
                            </View>


                        </View>
                    )}

                />

                <TouchableOpacity style={styles.addButton} onPress={() => {handleAddProject(Date.now())}}>
                    <Text style={styles.addButtonText}>Adicionar</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#7159c1',
        flex: 1,

    },

    listItem: {
        marginTop: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#f0f0f0',
    },

    subtitle: {
        fontSize: 18,
        color: '#f0f0f0',
    },

    removeButton: {
        height: 40,
        width: 40,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,100,100,1)',
    },

    removeButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    addButton: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(100,200,100,1)'
    },

    addButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    }
})