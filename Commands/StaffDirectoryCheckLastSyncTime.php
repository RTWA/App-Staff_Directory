<?php

namespace WebApps\Apps\StaffDirectory\Commands;

use DateTime;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use RobTrehy\LaravelApplicationSettings\ApplicationSettings;
use WebApps\Apps\StaffDirectory\Mail\NoAzureSyncMail;

class StaffDirectoryCheckLastSyncTime extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'StaffDirectory:check-last-sync-time';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks the last sync for the StaffDirectory App and notifies the technical contact if 2 syncs have been missed.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $last_sync = strtotime(ApplicationSettings::get('app.StaffDirectory.azure.last_sync'));
        $time_hour_ago = strtotime('-1 hour');

        if ($last_sync < $time_hour_ago) {
            // There is a problem!
            Mail::to(ApplicationSettings::get('app.StaffDirectory.azure.technical_contact'))
                ->send(new NoAzureSyncMail());

            $this->info('Technical contact has been notified');
        }
        
        return 0;
    }
}
