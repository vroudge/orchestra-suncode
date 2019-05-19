package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/crepehat/OrchestraCPE/interact"

	"github.com/crepehat/OrchestraCPE/api"
	"github.com/crepehat/OrchestraCPE/device"
)

func main() {
	var state device.State
	var currentCommand device.Command
	var err error
	// value
	currentConfig := device.Config{
		ObjectId: "a",
		Type:     "producer",
	}

	state = device.State{
		Available: true,
		MaxOutput: 10,
	}

	// set up timers for each process
	heartbeatTicker := time.NewTicker(1 * time.Second)
	configTicker := time.NewTicker(5 * time.Second)
	stateCheckTicker := time.NewTicker(1 * time.Second)
	stateSetTicket := time.NewTicker(1 * time.Second)

	// check state
	go func() {
		for {
			<-stateCheckTicker.C
			// this is currently fixed, would be extensible as configurable
			// extractors and insertors
			output, err := interact.CsvGetValue("legacy.csv", 0)
			if err != nil {
				fmt.Println(err)
			}
			maxOutput, err := interact.CsvGetValue("legacy.csv", 1)
			if err != nil {
				fmt.Println(err)
			}
			state.CurrentOutput, _ = strconv.Atoi(output)
			state.MaxOutput, _ = strconv.Atoi(maxOutput)

			// this is where we would iterate through the extractors and insertors
			for _, extractor := range currentConfig.Extractors {
				fmt.Println(extractor)
			}
			for _, insertor := range currentConfig.Inserters {
				fmt.Println(insertor)
			}

		}
	}()

	// set state
	go func() {
		for {
			<-stateSetTicket.C
			// currently unimplemented
		}
	}()

	// heartbeat
	go func() {
		for {
			<-heartbeatTicker.C
			// sends heartbeat and gets back current command from Orchestra
			currentCommand, err = api.SendHeartBeat(state)
			if err != nil {
				fmt.Println(err)
			}
		}
	}()

	// config checker
	go func() {
		for {
			<-configTicker.C
			// Dummy values
			reqConfig := device.Config{
				ObjectId:    "69",
				VillageId:   "70",
				Type:        "Storage",
				Commandable: true,
			}
			// Sends config, and sets any corrections orchestra makes to it
			currentConfig, err = api.SyncConfig(reqConfig)
			if err != nil {
				fmt.Println("Error receiving config: ", err.Error())
			}
			fmt.Printf("Received config: %+v\n", currentConfig)
		}
	}()

	// web server for checking config and command status
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	http.HandleFunc("/config", currentConfig.ShowHandler)
	http.HandleFunc("/command", currentCommand.ShowHandler)

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}
